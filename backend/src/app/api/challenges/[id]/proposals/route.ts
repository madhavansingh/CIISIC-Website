import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ProposalStatus } from "@prisma/client";
import { ProposalCreateSchema, ProposalQuerySchema } from "@/lib/validations/proposal";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import { serializeProposal } from "@/lib/serializers";
import {
  ok,
  created,
  badRequest,
  conflict,
  forbidden,
  notFound,
  unauthorized,
  serverError,
  validationError,
} from "@/lib/api-response";

/**
 * GET /api/challenges/[id]/proposals
 * - Industry SPOC: see proposals for own challenge (student PII hidden)
 * - Admin: see all proposals for challenge
 * - Students: forbidden (use /api/proposals for own)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const { searchParams } = new URL(req.url);
    const queryParsed = ProposalQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      status: searchParams.get("status"),
    });
    if (!queryParsed.success) return validationError(queryParsed.error.flatten());
    const { page, limit, status } = queryParsed.data;

    const role = session.user.role;
    const isAdmin = role === "SUPER_ADMIN" || role === "CII_ADMIN";
    const isIndustry = role === "INDUSTRY_SPOC";
    const isInstitutionSpoc = role === "INSTITUTION_SPOC";

    if (!isAdmin && !isIndustry && !isInstitutionSpoc) {
      return forbidden("Access denied");
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: { industryProfile: { select: { userId: true } } },
    });
    if (!challenge) return notFound("Challenge not found");

    // Industry SPOC can only see their own challenge's proposals
    if (isIndustry && challenge.industryProfile.userId !== session.user.id) {
      return forbidden("Access denied to this challenge's proposals");
    }

    const skip = (page - 1) * limit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      challengeId: id,
      ...(status ? { status } : {}),
    };

    let requestingUserInstitutionId: string | undefined;
    if (isInstitutionSpoc) {
      const spocProfile = await prisma.institutionProfile.findUnique({
        where: { userId: session.user.id },
        select: { institutionId: true },
      });
      if (!spocProfile) {
        return ok({
          data: [],
          pagination: { total: 0, page, limit, totalPages: 0 },
        });
      }
      where.studentProfile = { institutionId: spocProfile.institutionId };
      requestingUserInstitutionId = spocProfile.institutionId;
    }

    const [total, proposals] = await Promise.all([
      prisma.proposal.count({ where }),
      prisma.proposal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: "desc" },
        include: {
          studentProfile: {
            select: {
              userId: true,
              department: true,
              yearOfStudy: true,
              skills: true,
              institutionId: true,
              institution: { select: { name: true, city: true } },
              user: { select: { name: true, email: true } },
            },
          },
        },
      }),
    ]);

    const serialized = proposals.map((p) =>
      serializeProposal(p, role, session.user.id, requestingUserInstitutionId)
    );

    return ok({
      data: serialized,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/challenges/[id]/proposals]", err);
    return serverError();
  }
}

/**
 * POST /api/challenges/[id]/proposals
 * Student only — submit a proposal.
 * One proposal per student per challenge enforced by DB unique constraint.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();
    if (session.user.role !== "STUDENT" && session.user.role !== "INSTITUTION_SPOC") {
      return forbidden("Only students or institutions can submit proposals");
    }

    const challenge = await prisma.challenge.findUnique({ where: { id } });
    if (!challenge) return notFound("Challenge not found");
    if (challenge.status !== "OPEN") {
      return badRequest("This challenge is not open for submissions");
    }
    if (new Date() > challenge.deadline) {
      return badRequest("The deadline for this challenge has passed");
    }

    let studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile && session.user.role === "INSTITUTION_SPOC") {
      const instProfile = await prisma.institutionProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (!instProfile) {
        return badRequest("Institution profile not found");
      }
      studentProfile = await prisma.studentProfile.findFirst({
        where: { institutionId: instProfile.institutionId },
      });
      if (!studentProfile) {
        studentProfile = await prisma.studentProfile.create({
          data: {
            userId: session.user.id,
            institutionId: instProfile.institutionId,
            enrollmentNo: `INST-${Date.now().toString(36).toUpperCase()}`,
            department: instProfile.department || "Engineering",
            yearOfStudy: 4,
          },
        });
      }
    }

    if (!studentProfile) {
      return badRequest("Student profile not found — please complete registration");
    }

    const body = await req.json();
    const parsed = ProposalCreateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const { summary, approachDoc, isDraft } = parsed.data;

    // Check for duplicate or existing draft/revision request
    const existing = await prisma.proposal.findUnique({
      where: {
        challengeId_studentProfileId: {
          challengeId: id,
          studentProfileId: studentProfile.id,
        },
      },
    });

    let proposal;
    let transitionAction: "PROPOSAL_SUBMITTED" | "PROPOSAL_STATUS_CHANGED" = "PROPOSAL_SUBMITTED";

    if (existing) {
      if (
        existing.status === "SUBMITTED" ||
        existing.status === "UNDER_REVIEW" ||
        existing.status === "RESUBMITTED" ||
        existing.status === "APPROVED" ||
        existing.status === "REJECTED"
      ) {
        return conflict(`You have already submitted a proposal for this challenge (current status: ${existing.status})`);
      }

      let nextStatus: ProposalStatus = existing.status;
      if (!isDraft) {
        if (existing.status === "DRAFT") {
          nextStatus = "SUBMITTED";
        } else if (existing.status === "REVISION_REQUESTED") {
          nextStatus = "RESUBMITTED";
        }
      }

      proposal = await prisma.proposal.update({
        where: { id: existing.id },
        data: {
          summary,
          approachDoc: approachDoc ?? existing.approachDoc,
          status: nextStatus,
        },
      });
      transitionAction = "PROPOSAL_STATUS_CHANGED";
    } else {
      const initialStatus = isDraft ? "DRAFT" : "SUBMITTED";
      proposal = await prisma.proposal.create({
        data: {
          challengeId: id,
          studentProfileId: studentProfile.id,
          summary,
          approachDoc,
          status: initialStatus,
        },
      });
    }

    // Only notify industry if proposal is submitted/resubmitted
    if (proposal.status === "SUBMITTED" || proposal.status === "RESUBMITTED") {
      const industryProfile = await prisma.industryProfile.findUnique({
        where: { id: challenge.industryProfileId },
        select: { userId: true },
      });

      if (industryProfile) {
        await prisma.notification.create({
          data: {
            userId: industryProfile.userId,
            title: proposal.status === "RESUBMITTED" ? "Proposal Resubmitted" : "New Proposal Received",
            body: proposal.status === "RESUBMITTED"
              ? `A proposal has been resubmitted for your challenge: "${challenge.title}"`
              : `A new proposal has been submitted for your challenge: "${challenge.title}"`,
            link: `/api/challenges/${id}/proposals/${proposal.id}`,
          },
        });
      }
    }

    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: session.user.id,
      action: transitionAction,
      entityType: "Proposal",
      entityId: proposal.id,
      oldValue: existing ? { status: existing.status } : undefined,
      newValue: { challengeId: id, status: proposal.status },
      ipAddress,
      userAgent,
    });

    return created(proposal);
  } catch (err) {
    console.error("[POST /api/challenges/[id]/proposals]", err);
    return serverError();
  }
}
