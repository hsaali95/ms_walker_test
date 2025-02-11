import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE } from "./utils/enums";
import { errorResponse } from "./utils/response.decorator";
import JWTService from "./services/jwt/jwt-services";
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Role-based allowed routes
  const ADMIN_ROUTES = [
    "/survey",
    "/all-survey",
    "/register-user",
    "/activity",
    "all-activity",
    "/team",
    "/group",
  ];
  const AGENT_ROUTES = ["/survey", "/activity", "all-activity"];
  const MANAGER_ROUTES = [
    "/survey",
    "/all-survey",
    "/team",
    "/activity",
    "all-activity",
  ];

  // Public routes
  const isPublicPath = path === "/login" || path === "/signup";

  // Retrieve cookies
  const session_accessToken = request.cookies.get("session_accessToken")?.value;
  console.log(
    "+++++++++++++++session_accessToken++++++++++++++++++",
    session_accessToken
  );
  const userCookie = request.cookies.get("user")?.value;
  let user: any;

  try {
    user = userCookie ? JSON.parse(userCookie) : null;
  } catch (error) {
    console.error("Error parsing user cookie:", error);
  }
  if (!path.startsWith("/api")) {
    // ====================== Redirect logged-in users away from login/signup pages ======================
    if (isPublicPath) {
      if (session_accessToken)
        return NextResponse.redirect(new URL("/survey", request.url));
    }

    // ====================== Redirect non-logged-in users to login page ======================
    if (!isPublicPath && !session_accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // ====================== Role-based route access ======================
    if (session_accessToken && user) {
      if (user.role_id === ROLE.ADMIN && ADMIN_ROUTES.includes(path)) {
        // Admin trying to access admin routes, allow
        return NextResponse.next();
      }

      if (user.role_id === ROLE.AGENT && AGENT_ROUTES.includes(path)) {
        // Agent trying to access agent routes, allow
        return NextResponse.next();
      }
      if (user.role_id === ROLE.MANAGER && MANAGER_ROUTES.includes(path)) {
        // Agent trying to access agent routes, allow
        return NextResponse.next();
      }

      // Unauthorized access, redirect to login or a 403 page
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ============================================================
  // **************************BACKEND*********************************
  // ============================================================
  // Exclude do not check tokens verify here
  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (path.startsWith("/api")) {
    if (!session_accessToken) {
      return errorResponse("Unauthorized", 401);
    }

    try {
      const token: any =
        await JWTService.verifyAccessToken(session_accessToken);
      if (token?.payload?.id) {
        return NextResponse.next();
      }
    } catch {
      return errorResponse("Unauthorized", 401);
    }
  }

  // Default behavior for unmatched paths
  return NextResponse.next();
}

// Configuration to exclude certain paths
export const config = {
  matcher: [
    "/survey",
    "/all-survey",
    "/login",
    "/register-user",
    "/activity",
    "/api/:path*",
  ],
};
