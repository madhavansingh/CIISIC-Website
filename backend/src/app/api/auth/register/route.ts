import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { RegisterSchema } from "@/lib/validations/auth";
import { createAuditLog } from "@/lib/audit";
import {
  badRequest,
  conflict,
  created,
  serverError,
  validationError,
} from "@/lib/api-response";

/**
 * POST /api/auth/register
 * Creates a new user with role-specific profile in a single transaction.
 *
 * Body: { email, password, name, role, ...roleSpecificFields }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const data = parsed.data;

    // Check email uniqueness
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return conflict("An account with this email already exists");
    }

    const passwordHash = await hashPassword(data.password);

    // Role-specific validation
    if (data.role === "STUDENT") {
      if (!data.enrollmentNo || !data.institutionId || !data.department) {
        return badRequest(
          "Students must provide enrollmentNo, institutionId, and department"
        );
      }
      const institution = await prisma.institution.findUnique({
        where: { id: data.institutionId },
      });
      if (!institution) {
        return badRequest("Institution not found");
      }
      const existingEnrollment = await prisma.studentProfile.findUnique({
        where: { enrollmentNo: data.enrollmentNo },
      });
      if (existingEnrollment) {
        return conflict("Enrollment number already registered");
      }
    }

    if (data.role === "INDUSTRY_SPOC" && !data.companyName) {
      return badRequest("Industry users must provide company name");
    }

    if (data.role === "INSTITUTION_SPOC" && !data.spocInstitutionId) {
      return badRequest("Institution SPOCs must provide their institution ID");
    }

    const requiresApproval = data.role === "INDUSTRY_SPOC" || data.role === "INSTITUTION_SPOC";

    // Create user + profile in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          role: data.role,
          passwordHash,
          isActive: !requiresApproval,
          approvalStatus: requiresApproval ? "PENDING" : "APPROVED",
        },
      });

      if (data.role === "STUDENT") {
        await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            enrollmentNo: data.enrollmentNo!,
            institutionId: data.institutionId!,
            department: data.department!,
            yearOfStudy: data.yearOfStudy ?? 1,
            skills: data.skills ?? [],
          },
        });
      } else if (data.role === "INDUSTRY_SPOC") {
        await tx.industryProfile.create({
          data: {
            userId: newUser.id,
            companyName: data.companyName!,
            industry: data.industry ?? "General",
            websiteUrl: data.websiteUrl || null,
            isCIIMember: data.isCIIMember ?? false,
          },
        });
      } else if (data.role === "INSTITUTION_SPOC") {
        let instId = data.spocInstitutionId || "Partner Institution";
        const found = await tx.institution.findFirst({
          where: {
            OR: [
              { id: instId },
              { name: { equals: instId, mode: "insensitive" } },
            ],
          },
        });

        if (found) {
          instId = found.id;
        } else {
          const createdInst = await tx.institution.create({
            data: {
              name: instId,
              city: "Madhya Pradesh",
            },
          });
          instId = createdInst.id;
        }

        await tx.institutionProfile.create({
          data: {
            userId: newUser.id,
            institutionId: instId,
            designation: data.designation ?? "CII SPOC",
            department: data.department ?? "Engineering",
          },
        });
      }

      return newUser;
    });

    await createAuditLog({
      userId: user.id,
      action: "USER_REGISTERED",
      entityType: "User",
      entityId: user.id,
      newValue: { email: user.email, role: user.role },
      ipAddress:
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown",
      userAgent: req.headers.get("user-agent") ?? "unknown",
    });

    return created({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      approvalStatus: user.approvalStatus,
      requiresApproval,
    });
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    return serverError();
  }
}
