import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/roles";
import { UserRole } from "@/types/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect to appropriate dashboard if logged in and accessing auth pages
  if (isAuthPage && session) {
    const role = session.user.role as UserRole;
    const dashboardPath = getDashboardPath(role);
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // Role-based route protection for dashboard paths
  if (isProtectedRoute && session) {
    const currentPath = request.nextUrl.pathname;
    const userRole = session.user.role as UserRole;
    const allowedPath = getDashboardPath(userRole);
    
    // If user is trying to access a different role's dashboard, redirect to their own
    if (currentPath !== allowedPath && !currentPath.startsWith(allowedPath)) {
      return NextResponse.redirect(new URL(allowedPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
