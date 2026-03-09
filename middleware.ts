import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|wav)$).*)",
  ],
};
