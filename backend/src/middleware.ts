import { verifyToken } from "./lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES: Record<string, string[]> = {
  "/api/admin": ["SUPER_ADMIN", "CII_ADMIN"],
  "/api/users": ["SUPER_ADMIN", "CII_ADMIN"],
};

const AUTH_REQUIRED_PREFIXES = [
  "/api/auth/me",
  "/api/auth/change-password",
  "/api/challenges",
  "/api/proposals",
  "/api/messages",
  "/api/notifications",
  "/api/admin",
  "/api/users",
  "/api/upload",
];

const PUBLIC_API_PREFIXES = [
  "/api/health",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const origin = req.headers.get("origin") || "";
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
  ].filter((o): o is string => typeof o === "string")
   .map(o => o.trim());

  const isAllowedOrigin = allowedOrigins.includes(origin);
  const activeOrigin = isAllowedOrigin ? origin : (process.env.FRONTEND_URL || "");

  // 1. Handle CORS preflight OPTIONS requests early
  if (req.method === "OPTIONS") {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", activeOrigin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    headers.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    return new NextResponse(null, { status: 204, headers });
  }

  // 2. Response helper to set CORS headers
  const withCors = (res: NextResponse) => {
    if (res && res.headers && res.headers.has("Access-Control-Allow-Origin")) {
      return res;
    }
    res.headers.set("Access-Control-Allow-Origin", activeOrigin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.headers.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    return res;
  };

  // Allow public API routes early
  const isPublic = PUBLIC_API_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // GET /api/challenges and GET /api/challenges/[id] are public
  let requiresAuth = AUTH_REQUIRED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (pathname.startsWith("/api/challenges") && req.method === "GET") {
    requiresAuth = false;
  }

  if (isPublic) {
    return withCors(NextResponse.next());
  }

  if (requiresAuth) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return withCors(NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      ));
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);

    if (!payload) {
      return withCors(NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      ));
    }

    // Role-based protection for specific route prefixes
    for (const [route, roles] of Object.entries(PROTECTED_ROUTES)) {
      if (pathname.startsWith(route)) {
        const userRole = payload.role;
        if (!userRole || !roles.includes(userRole)) {
          return withCors(NextResponse.json(
            { success: false, message: "Insufficient permissions" },
            { status: 403 }
          ));
        }
        break;
      }
    }

    // Attach user payload as request headers for route handlers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.id);
    requestHeaders.set("x-user-role", payload.role);
    requestHeaders.set("x-user-email", payload.email);

    return withCors(NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    }));
  }

  return withCors(NextResponse.next());
}

export const config = {
  matcher: ["/api/:path*"],
};
