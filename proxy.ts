import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
]);

/**
 * Clerk middleware only on facilitator routes.
 * The public workbook (`/`) must not depend on Clerk edge/network calls
 * so participants in mainland China can load the pack without VPN.
 */
export default clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) return;

  const { userId } = await auth();
  if (!userId) {
    const signIn = new URL("/sign-in", req.url);
    signIn.searchParams.set("redirect_url", req.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/sign-in/:path*",
    "/sign-up/:path*",
    "/sso-callback",
    "/sso-callback/:path*",
  ],
};
