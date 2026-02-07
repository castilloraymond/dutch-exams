import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { description, page_url, feedback_type, email, user_agent, screen_size } = body;

        if (!description || typeof description !== "string" || !description.trim()) {
            return NextResponse.json(
                { error: "Description is required" },
                { status: 400 }
            );
        }

        if (!isSupabaseConfigured() || !supabase) {
            console.log("Beta feedback (dev mode):", { description, page_url, feedback_type, email });
            return NextResponse.json(
                { success: true, message: "Feedback received. Thank you!" },
                { status: 201 }
            );
        }

        const { error } = await supabase
            .from("beta_feedback")
            .insert({
                description: description.trim(),
                page_url: page_url || null,
                feedback_type: feedback_type || "bug",
                email: email?.trim() || null,
                user_agent: user_agent || null,
                screen_size: screen_size || null,
            });

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json(
                { error: "Failed to submit feedback. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Feedback received. Thank you!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Feedback error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
