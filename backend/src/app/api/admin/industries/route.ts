import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ok,
  forbidden,
  unauthorized,
  serverError,
} from "@/lib/api-response";

/**
 * GET /api/admin/industries
 * Admin only — fetch industry profile registrations.
 */
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
