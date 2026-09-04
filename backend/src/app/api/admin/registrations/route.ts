import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized, forbidden, serverError } from "@/lib/api-response";

/**
 * GET /api/admin/registrations
 * List registrations for Industry and Institution SPOCs with approvalStatus.
 * Accessible only to CII_ADMIN and SUPER_ADMIN.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const isAdmin =
      session.user.role === "SUPER_ADMIN" || session.user.role === "CII_ADMIN";
    if (!isAdmin) return forbidden("Admin access required");

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // PENDING | APPROVED | REJECTED | ALL
    const role = searchParams.get("role"); // INDUSTRY_SPOC | INSTITUTION_SPOC

    const where: any = {
      role: {
        in: ["INDUSTRY_SPOC", "INSTITUTION_SPOC"],
      },
    };

    if (role && (role === "INDUSTRY_SPOC" || role === "INSTITUTION_SPOC")) {
      where.role = role;
    }

    if (status && status !== "ALL") {
      where.approvalStatus = status;
    }

    const registrations = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        industryProfile: true,
        institutionProfile: {
          include: { institution: true },
        },
      },
    });

    const safeRegistrations = registrations.map(({ passwordHash: _, ...user }) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      approvalStatus: user.approvalStatus,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      entityName:
        user.role === "INDUSTRY_SPOC"
          ? user.industryProfile?.companyName || "Industry Partner"
          : user.institutionProfile?.institution?.name || "Partner Academic Institution",
      industrySector:
        user.role === "INDUSTRY_SPOC"
          ? user.industryProfile?.industry
          : undefined,
      department:
        user.role === "INSTITUTION_SPOC"
          ? user.institutionProfile?.department
          : undefined,
      designation:
        user.role === "INDUSTRY_SPOC"
          ? "Industry SPOC"
          : user.institutionProfile?.designation || "Academic SPOC",
      websiteUrl: user.industryProfile?.websiteUrl,
      isCIIMember: user.industryProfile?.isCIIMember,
      institutionCity: user.institutionProfile?.institution?.city,
    }));

    return ok(safeRegistrations);
  } catch (err) {
    console.error("[GET /api/admin/registrations]", err);
    return serverError();
  }
}
