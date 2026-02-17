import { createServerComponentClient } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Authentication not configured" },
        { status: 503 }
      );
    }

    // Get the current user
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

    const body = await request.json();
    const {
      examId,
      module,
      difficulty,
      score,
      totalQuestions,
      timeTakenSeconds,
      answerData,
    } = body;

    // Rate limit: 50 requests per hour per user
    const { allowed, retryAfterMs } = rateLimit(`exam-results:${user.id}`, 50, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    // Validate required fields
    if (!examId || !module || !difficulty || score === undefined || !totalQuestions || timeTakenSeconds === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Whitelist module and difficulty values
    const VALID_MODULES = ["lezen", "knm", "luisteren", "schrijven", "spreken"];
    const VALID_DIFFICULTIES = ["A1", "A2"];
    if (!VALID_MODULES.includes(module)) {
      return NextResponse.json({ error: "Invalid module" }, { status: 400 });
    }
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
    }

    // Cap answerData size to prevent oversized payloads
    if (answerData && JSON.stringify(answerData).length > 50000) {
      return NextResponse.json({ error: "Answer data too large" }, { status: 400 });
    }

    // Validate score values
    if (
      !Number.isInteger(score) || score < 0 ||
      !Number.isInteger(totalQuestions) || totalQuestions < 1 ||
      score > totalQuestions ||
      typeof timeTakenSeconds !== "number" || timeTakenSeconds < 0
    ) {
      return NextResponse.json(
        { error: "Invalid score values" },
        { status: 400 }
      );
    }

    const percentage = Math.round((score / totalQuestions) * 100 * 100) / 100;
    const passed = percentage >= 60;

    const { data, error } = await supabase
      .from("exam_results")
      .insert({
        user_id: user.id,
        exam_id: examId,
        module,
        difficulty,
        score,
        total_questions: totalQuestions,
        percentage,
        passed,
        time_taken_seconds: timeTakenSeconds,
        answer_data: answerData || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving exam result:", error);
      return NextResponse.json(
        { error: "Failed to save exam result" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, result: data });
  } catch (error) {
    console.error("Error in POST /api/exam-results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createServerComponentClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Authentication not configured" },
        { status: 503 }
      );
    }

    // Get the current user
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

    const { data, error } = await supabase
      .from("exam_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching exam results:", error);
      return NextResponse.json(
        { error: "Failed to fetch exam results" },
        { status: 500 }
      );
    }

    return NextResponse.json({ results: data });
  } catch (error) {
    console.error("Error in GET /api/exam-results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
