import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/blog(.*)",
  "/guide(.*)",
  "/faq(.*)",
  "/try(.*)",
  "/auth/login(.*)",
  "/auth/signup(.*)",
  "/auth/reset-password(.*)",
  "/auth/update-password(.*)",
  "/api/stripe/webhook",
  "/api/clerk/webhook",
  "/api/feedback",
  "/api/loops(.*)",
  "/api/tts(.*)",
  "/upgrade(.*)",
  "/quick-assessment(.*)",
]);

// If Clerk keys are not configured, skip auth entirely so the site stays up
const clerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

export default clerkConfigured
  ? clerkMiddleware(async (auth, request) => {
      if (!isPublicRoute(request)) {
        await auth.protect();
      }
    })
  : () => NextResponse.next();

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|wav)$).*)",
  ],
};
