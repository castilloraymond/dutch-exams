import { createServerComponentClient } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import type { UserProgress } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Authentication not configured" },
        { status: 503 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = user.email;
    if (!email) {
      return NextResponse.json(
        { error: "User email not available" },
        { status: 400 }
      );
    }

    // Rate limit: 30 requests per 15 minutes per user
    const { allowed, retryAfterMs } = rateLimit(`progress:${email}`, 30, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    const { progress } = (await request.json()) as {
      progress: UserProgress;
    };

    if (!progress) {
      return NextResponse.json(
        { error: "Progress data is required" },
        { status: 400 }
      );
    }

    // Cap payload size to prevent oversized writes
    if (JSON.stringify(progress).length > 100000) {
      return NextResponse.json(
        { error: "Progress data too large" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("user_progress").upsert(
      {
        email,
        progress_data: {
          passageProgress: progress.passageProgress || {},
          writingProgress: progress.writingProgress || {},
          speakingProgress: progress.speakingProgress || {},
        },
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "email",
      }
    );

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save progress" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Authentication not configured" },
        { status: 503 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = user.email;
    if (!email) {
      return NextResponse.json(
        { error: "User email not available" },
        { status: 400 }
      );
    }

    // Rate limit: 30 requests per 15 minutes per user
    const { allowed, retryAfterMs } = rateLimit(`progress:${email}`, 30, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    const { data, error } = await supabase
      .from("user_progress")
      .select("progress_data")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return NextResponse.json({ progress: null });
      }
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to load progress" },
        { status: 500 }
      );
    }

    const progressData = data.progress_data;
    return NextResponse.json({
      progress: {
        passageProgress: progressData.passageProgress ?? progressData,
        writingProgress: progressData.writingProgress ?? {},
        speakingProgress: progressData.speakingProgress ?? {},
        email,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
