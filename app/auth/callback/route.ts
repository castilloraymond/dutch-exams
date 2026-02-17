import { createServerComponentClient } from "@/lib/supabase-server";
import { validateRedirect } from "@/lib/validate-redirect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");
  const redirect = requestUrl.searchParams.get("redirect");

  if (code) {
    const supabase = await createServerComponentClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Auth callback error:", error.message);
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`, request.url)
        );
      }
    }
  }

  // Redirect to password update page for recovery flow
  if (type === "recovery") {
    return NextResponse.redirect(new URL("/auth/update-password", request.url));
  }

  // Redirect to the specified page or default to /learn
  const redirectPath = validateRedirect(redirect);
  return NextResponse.redirect(new URL(redirectPath, request.url));
}
