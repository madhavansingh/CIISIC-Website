import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import {
  ok,
  forbidden,
  unauthorized,
  serverError,
  badRequest,
  notFound,
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const isAdmin =
      session.user.role === "SUPER_ADMIN" ||
      session.user.role === "CII_ADMIN";

    if (!isAdmin) {
      return forbidden("Only administrators can view industry registrations");
    }

    const industries = await prisma.industryProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return ok(industries);
  } catch (err) {
    console.error("[GET /api/admin/industries]", err);
    return serverError();
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const isAdmin =
      session.user.role === "SUPER_ADMIN" ||
      session.user.role === "CII_ADMIN";

    if (!isAdmin) {
      return forbidden("Only administrators can review industry registrations");
    }

    const { id } = await params;
    const body = await req.json();

    const statusVal = String(body.status || body.action || "").toUpperCase();
    const isApprove = statusVal === "APPROVED" || statusVal === "APPROVE";
    const isReject = statusVal === "REJECTED" || statusVal === "REJECT";

    if (!isApprove && !isReject) {
      return badRequest("Status must be APPROVED or REJECTED (or action APPROVE or REJECT)");
    }

    const rejectionReason =
      typeof body.rejectionReason === "string" && body.rejectionReason.trim()
        ? body.rejectionReason.trim()
        : typeof body.remarks === "string" && body.remarks.trim()
        ? body.remarks.trim()
        : "";

    if (isReject && !rejectionReason) {
      return badRequest("Rejection reason is required when rejecting an industry");
    }

    const industry = await prisma.industryProfile.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!industry) {
      return notFound("Industry registration not found");
    }

    const nextStatus = isApprove ? "APPROVED" : "REJECTED";

    const updatedIndustry = await prisma.industryProfile.update({
      where: { id },
      data: {
        registrationStatus: nextStatus,
        approvedAt: isApprove ? new Date() : null,
        approvedBy: isApprove ? session.user.id : null,
        rejectionReason: isReject ? rejectionReason : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Notify the industry user
    await prisma.notification.create({
      data: {
        userId: industry.userId,
        title: isApprove
          ? "Industry Registration Approved"
          : "Industry Registration Rejected",
        body: isApprove
          ? "Your industry registration has been approved. You can now post problem statements."
          : `Your industry registration was rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ""}`,
      },
    }).catch(console.error);

    // Audit Log
    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: session.user.id,
      action: isApprove
        ? "INDUSTRY_REGISTRATION_APPROVED"
        : "INDUSTRY_REGISTRATION_REJECTED",
      entityType: "IndustryProfile",
      entityId: industry.id,
      oldValue: {
        registrationStatus: industry.registrationStatus,
        companyName: industry.companyName,
      },
      newValue: {
        registrationStatus: updatedIndustry.registrationStatus,
        approvedAt: updatedIndustry.approvedAt,
        approvedBy: updatedIndustry.approvedBy,
        rejectionReason: updatedIndustry.rejectionReason,
      },
      ipAddress,
      userAgent,
    });

    return ok(updatedIndustry);
  } catch (err) {
    console.error("[POST /api/admin/industries/:id/review]", err);
    return serverError();
  }
}

