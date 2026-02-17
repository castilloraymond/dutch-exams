import { createServerComponentClient } from "@/lib/supabase-server";
import { validateRedirect } from "@/lib/validate-redirect";
import { createLoopsContact, sendLoopsEvent } from "@/lib/loops";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");
  const redirect = requestUrl.searchParams.get("redirect");

  if (code) {
    const supabase = await createServerComponentClient();
    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Auth callback error:", error.message);
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`, request.url)
        );
      }

      // Fire Loops signup event (non-blocking)
      if (data.user) {
        const email = data.user.email;
        const firstName =
          data.user.user_metadata?.full_name?.split(" ")[0] ||
          data.user.user_metadata?.first_name ||
          "";
        if (email) {
          createLoopsContact({
            email,
            properties: {
              firstName,
              signupDate: new Date().toISOString(),
              quickAssessmentCompleted: false,
              exercisesCompleted: 0,
            },
          }).then(() =>
            sendLoopsEvent({ email, eventName: "user_signed_up" })
          );
        }
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
