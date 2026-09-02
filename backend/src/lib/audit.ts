import { prisma } from "./prisma";

type AuditAction =
  | "USER_REGISTERED"
  | "INDUSTRY_REGISTRATION_APPROVED"
  | "INDUSTRY_REGISTRATION_REJECTED"
  | "USER_LOGIN"
  | "USER_ACTIVATED"
  | "USER_DEACTIVATED"
  | "USER_ROLE_CHANGED"
  | "CHALLENGE_CREATED"
  | "CHALLENGE_UPDATED"
  | "CHALLENGE_SUBMITTED"
  | "CHALLENGE_APPROVED"
  | "CHALLENGE_REJECTED"
  | "CHALLENGE_STATUS_CHANGED"
  | "CHALLENGE_DELETED"
  | "PROPOSAL_SUBMITTED"
  | "PROPOSAL_STATUS_CHANGED"
  | "PROPOSAL_REVISION_REQUESTED"
  | "PROPOSAL_APPROVED"
  | "PROPOSAL_REJECTED"
  | "MESSAGE_SENT"
  | "INSTITUTION_CREATED"
  | "INSTITUTION_UPDATED"
  | "INSTITUTION_DELETED"
  | "FILE_UPLOADED"
  | "ADMIN_ACTION";

interface AuditParams {
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        oldValue: params.oldValue ? (params.oldValue as any) : undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newValue: params.newValue ? (params.newValue as any) : undefined,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });

  } catch (err) {
    // Audit log failures must never break the primary operation
    console.error("[AuditLog] Failed to write audit entry:", err);
  }
}

export function getRequestMeta(request: Request): {
  ipAddress: string;
  userAgent: string;
} {
  const forwarded = request.headers.get("x-forwarded-for");
  const ipAddress = forwarded
    ? forwarded.split(",")[0].trim()
    : "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  return { ipAddress, userAgent };
}
