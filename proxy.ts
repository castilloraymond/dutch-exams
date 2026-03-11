import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// 1. Allowed origins — only your production domain (www + apex)
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = new Set([
  "https://www.passinburgering.com",
  "https://passinburgering.com",
]);

// In development, also allow localhost
if (process.env.NODE_ENV === "development") {
  ALLOWED_ORIGINS.add("http://localhost:3000");
}

// ---------------------------------------------------------------------------
// 2. Public routes (no Clerk auth required)
// ---------------------------------------------------------------------------
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
  "/api/subscribe",
  "/api/reddit-response",
  "/upgrade(.*)",
  "/quick-assessment(.*)",
]);

// Routes that are API endpoints (need CORS headers)
const isApiRoute = (pathname: string) => pathname.startsWith("/api/");

// Webhook routes should skip CORS (called server-to-server)
const isWebhookRoute = (pathname: string) =>
  pathname === "/api/stripe/webhook" || pathname === "/api/clerk/webhook";

// ---------------------------------------------------------------------------
// 3. CORS helpers
// ---------------------------------------------------------------------------
function getOrigin(request: NextRequest): string | null {
  return request.headers.get("origin");
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.has(origin);
}

function setCorsHeaders(
  response: NextResponse,
  origin: string,
  isPreflight = false
) {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  if (isPreflight) {
    response.headers.set("Access-Control-Max-Age", "86400"); // 24h cache
  }
  return response;
}

// ---------------------------------------------------------------------------
// 4. Security headers (applied to ALL responses)
// ---------------------------------------------------------------------------
function setSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=(), payment=()"
  );
  // Only set HSTS in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
  return response;
}

// ---------------------------------------------------------------------------
// 5. Main middleware
// ---------------------------------------------------------------------------
const clerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

function handleCorsAndSecurity(request: NextRequest, response: NextResponse) {
  const origin = getOrigin(request);
  const pathname = request.nextUrl.pathname;

  // Add security headers to every response
  setSecurityHeaders(response);

  // CORS only applies to API routes (skip webhooks — they're server-to-server)
  if (isApiRoute(pathname) && !isWebhookRoute(pathname) && origin) {
    if (isAllowedOrigin(origin)) {
      setCorsHeaders(response, origin);
    }
    // If origin is not allowed, no CORS headers are set → browser blocks it
  }

  return response;
}

export default clerkConfigured
  ? clerkMiddleware(async (auth, request) => {
      const pathname = request.nextUrl.pathname;

      // Handle CORS preflight (OPTIONS) — must respond before auth check
      if (request.method === "OPTIONS" && isApiRoute(pathname)) {
        const origin = getOrigin(request);
        if (origin && isAllowedOrigin(origin)) {
          const preflightResponse = new NextResponse(null, { status: 204 });
          setCorsHeaders(preflightResponse, origin, true);
          setSecurityHeaders(preflightResponse);
          return preflightResponse;
        }
        // Reject preflight from disallowed origins
        return new NextResponse(null, { status: 403 });
      }

      // Protect non-public routes with Clerk
      if (!isPublicRoute(request)) {
        await auth.protect();
      }

      // Apply CORS + security headers to the forwarded response
      const response = NextResponse.next();
      return handleCorsAndSecurity(request, response);
    })
  : (request: NextRequest) => {
      const pathname = request.nextUrl.pathname;

      // Handle CORS preflight without Clerk
      if (request.method === "OPTIONS" && isApiRoute(pathname)) {
        const origin = getOrigin(request);
        if (origin && isAllowedOrigin(origin)) {
          const preflightResponse = new NextResponse(null, { status: 204 });
          setCorsHeaders(preflightResponse, origin, true);
          setSecurityHeaders(preflightResponse);
          return preflightResponse;
        }
        return new NextResponse(null, { status: 403 });
      }

      const response = NextResponse.next();
      return handleCorsAndSecurity(request, response);
    };

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|wav)$).*)",
  ],
};
