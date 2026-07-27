import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { generateToken } from "@/lib/auth";

const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const corsHeaders = (origin: string) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
  ].filter((o): o is string => typeof o === "string")
   .map(o => o.trim());

  const activeOrigin = allowedOrigins.includes(origin) ? origin : (process.env.FRONTEND_URL || "");

  return {
    "Access-Control-Allow-Origin": activeOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  };
};

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const headers = corsHeaders(origin);

  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400, headers }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        industryProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401, headers }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Your account has been deactivated" },
        { status: 401, headers }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, message: "This account uses a different sign-in method" },
        { status: 401, headers }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401, headers }
      );
    }

    // Role verification: Only CII_ADMIN, INDUSTRY_SPOC, SUPER_ADMIN and INSTITUTION_SPOC allowed to authenticate
    if (
      user.role !== "CII_ADMIN" &&
      user.role !== "INDUSTRY_SPOC" &&
      user.role !== "SUPER_ADMIN" &&
      user.role !== "INSTITUTION_SPOC"
    ) {
      return NextResponse.json(
        { success: false, message: "Insufficient permissions to access portals" },
        { status: 403, headers }
      );
    }

    // Generate JWT
    const token = await generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGIN",
        entityType: "User",
        entityId: user.id,
        newValue: { email: user.email },
      },
    }).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl || null,
          industryProfile: user.industryProfile,
        },
      },
      { status: 200, headers }
    );
  } catch (err) {
    console.error("[POST /api/auth/login] error:", err);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500, headers }
    );
  }
}
