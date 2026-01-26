import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { UserProgress } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  try {
    const { email, progress } = (await request.json()) as {
      email: string;
      progress: UserProgress;
    };

    if (!email || !progress) {
      return NextResponse.json(
        { error: "Email and progress are required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("user_progress").upsert(
      {
        email,
        progress_data: progress.passageProgress,
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

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
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

    return NextResponse.json({
      progress: {
        passageProgress: data.progress_data,
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
