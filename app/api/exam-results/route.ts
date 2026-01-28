import { createServerComponentClient } from "@/lib/supabase-server";
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

    // Validate required fields
    if (!examId || !module || !difficulty || score === undefined || !totalQuestions || timeTakenSeconds === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
