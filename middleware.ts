import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // If an OAuth code arrives at any path other than /auth/callback,
  // redirect to the callback handler to exchange it for a session.
  // This handles the case where Supabase redirects to the Site URL
  // instead of the configured redirectTo URL.
  if (searchParams.has("code") && pathname !== "/auth/callback") {
    const callbackUrl = new URL("/auth/callback", request.url);
    // Preserve all query params (code, redirect, etc.)
    searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(callbackUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
