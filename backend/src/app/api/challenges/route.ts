import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ChallengeCreateSchema,
  ChallengeQuerySchema,
} from "@/lib/validations/challenge";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import { serializeChallenge } from "@/lib/serializers";
import {
  ok,
  created,
  badRequest,
  unauthorized,
  forbidden,
  serverError,
  validationError,
} from "@/lib/api-response";
import type { Prisma } from "@prisma/client";

/**
 * GET /api/challenges
 * Public-ish: returns OPEN challenges to all; DRAFT/CLOSED visible only to relevant roles.
 * Query params: page, limit, status, domain, deadline, search, sortBy, sortOrder
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const role = session?.user?.role;
    const userId = session?.user?.id;

    const { searchParams } = new URL(req.url);

    // Only include query params that actually exist.
    // Missing params remain undefined so Zod defaults/optional fields work correctly.
    const queryParsed = ChallengeQuerySchema.safeParse(
      Object.fromEntries(searchParams.entries())
    );

    if (!queryParsed.success) {
      return validationError(queryParsed.error.flatten());
    }

    const {
      page,
      limit,
      status,
      domain,
      deadline,
      search,
      sortBy,
      sortOrder,
    } = queryParsed.data;

    const skip = (page - 1) * limit;

    const where: Prisma.ChallengeWhereInput = {};

    if (!role || role === "STUDENT") {
      // Students and public can only view OPEN challenges
      where.status = "OPEN";
    } else if (role === "INDUSTRY_SPOC" && userId) {
      const profile = await prisma.industryProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      const industryId = profile?.id ?? "none";

      if (status) {
        if (status === "OPEN") {
          where.status = "OPEN";
        } else {
          where.status = status;
          where.industryProfileId = industryId;
        }
      } else {
        where.OR = [
          { status: "OPEN" },
          { industryProfileId: industryId },
        ];
      }
    } else {
      // Admin/CII Admin/Super Admin
      if (status) {
        where.status = status;
      }
    }

    if (domain) {
      where.domain = domain;
    }

    if (deadline) {
      where.deadline = {
        gte: new Date(deadline),
      };
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          problemStatement: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ];
    }

    const [total, challenges] = await Promise.all([
      prisma.challenge.count({ where }),
      prisma.challenge.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          industryProfile: {
            select: {
              id: true,
              userId: true,
              companyName: true,
              industry: true,
              logoUrl: true,
              isCIIMember: true,
              user: {
                select: {
                  email: true,
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              proposals: true,
            },
          },
        },
      }),
    ]);

    const serialized = challenges.map((challenge) =>
      serializeChallenge(
        challenge,
        (role as never) ?? "STUDENT",
        userId
      )
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
    console.error("[GET /api/challenges]", err);
    return serverError();
  }
}

/**
 * POST /api/challenges
 * Industry SPOC only — creates a new challenge.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    if (session.user.role !== "INDUSTRY_SPOC") {
      return forbidden("Only Industry SPOCs can create challenges");
    }

    const body = await req.json();

    const parsed = ChallengeCreateSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const data = parsed.data;

    const industryProfile = await prisma.industryProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!industryProfile) {
      return badRequest(
        "Industry profile not found — please complete registration"
      );
    }

    if (industryProfile.registrationStatus !== "APPROVED") {
      return forbidden(
        "Your industry registration must be approved before posting problem statements"
      );
    }

    const challenge = await prisma.challenge.create({
      data: {
        title: data.title,
        description: data.description,
        problemStatement: data.problemStatement,
        domain: data.domain,
        deadline: new Date(data.deadline),
        budgetRange: data.budgetRange,
        tags: data.tags ?? [],
        attachmentUrls: data.attachmentUrls ?? [],
        industryProfileId: industryProfile.id,
        status: data.status ?? "DRAFT",
        organizationName:
          data.organizationName ?? industryProfile.companyName,
        duration: data.duration ?? null,
      },
    });

    const { ipAddress, userAgent } = getRequestMeta(req);

    await createAuditLog({
      userId: session.user.id,
      action: "CHALLENGE_CREATED",
      entityType: "Challenge",
      entityId: challenge.id,
      newValue: {
        title: challenge.title,
        domain: challenge.domain,
      },
      ipAddress,
      userAgent,
    });

    return created(challenge);
  } catch (err) {
    console.error("[POST /api/challenges]", err);
    return serverError();
  }
}