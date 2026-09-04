import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import {
  ok,
  badRequest,
  forbidden,
  notFound,
  unauthorized,
  serverError,
  validationError,
} from "@/lib/api-response";

const ReviewSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  remarks: z.string().max(500).optional(),
});

/**
 * POST /api/admin/registrations/[id]/review
 * Admin reviews (approves or rejects) an Industry or Institution registration.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const isAdmin =
      session.user.role === "SUPER_ADMIN" || session.user.role === "CII_ADMIN";
    if (!isAdmin) {
      return forbidden("Only administrators can review registrations");
    }

    const body = await req.json();
    const parsed = ReviewSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const { action, remarks } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        industryProfile: true,
        institutionProfile: {
          include: { institution: true },
        },
      },
    });

    if (!user) {
      return notFound("User registration not found");
    }

    if (user.role !== "INDUSTRY_SPOC" && user.role !== "INSTITUTION_SPOC") {
      return badRequest("Only industry and institution registrations require approval");
    }

    const isApprove = action === "APPROVE";
    const nextStatus = isApprove ? "APPROVED" : "REJECTED";
    const nextActive = isApprove;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        approvalStatus: nextStatus,
        isActive: nextActive,
      },
    });

    // Create in-app notification for the user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: isApprove
          ? "Registration Approved by CII Admin"
          : "Registration Update from CII Admin",
        body: isApprove
          ? "Your account registration has been approved. You may now sign in to access all platform features."
          : `Your account registration was not approved.${remarks ? ` Reason: ${remarks}` : ""}`,
      },
    });

    // Write audit log
    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: session.user.id,
      action: "ADMIN_ACTION",
      entityType: "User",
      entityId: user.id,
      oldValue: { approvalStatus: user.approvalStatus, isActive: user.isActive },
      newValue: { approvalStatus: nextStatus, isActive: nextActive, remarks },
      ipAddress,
      userAgent,
    });

    return ok({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      approvalStatus: updatedUser.approvalStatus,
      isActive: updatedUser.isActive,
      message: `Registration ${isApprove ? "approved" : "rejected"} successfully`,
    });
  } catch (err) {
    console.error("[POST /api/admin/registrations/[id]/review]", err);
    return serverError();
  }
}
