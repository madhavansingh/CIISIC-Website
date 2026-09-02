import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ok,
  forbidden,
  unauthorized,
  serverError,
  badRequest,
  notFound,
} from "@/lib/api-response";

/**
 * GET /api/admin/audit
 * Admin only — immutable audit log viewer.
 * Query: page, limit, userId, entityType, entityId, action, from, to
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const isAdmin =
      session.user.role === "SUPER_ADMIN" ||
      session.user.role === "CII_ADMIN";
    if (!isAdmin) return forbidden("Admin access required");

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"));
    const userId = searchParams.get("userId");
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");
    const action = searchParams.get("action");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (userId) where.userId = userId;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (action) where.action = { contains: action, mode: "insensitive" };
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return ok({
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/audit]", err);
    return serverError();
  }
}
