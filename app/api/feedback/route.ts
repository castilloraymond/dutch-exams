import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { appendBugToTracker } from "@/lib/github-bugs";

export async function POST(request: NextRequest) {
    try {
        // Rate limit: 10 requests per 15 minutes per IP
        const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        const { allowed, retryAfterMs } = rateLimit(`feedback:${ip}`, 10, 15 * 60 * 1000);
        if (!allowed) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
            );
        }

        const body = await request.json();
        let { page_url } = body;
        const { feedback_type } = body;
        let { description, email, user_agent, screen_size } = body;

        // Whitelist feedback_type
        const VALID_FEEDBACK_TYPES = ["bug", "feature", "improvement", "other"];
        if (feedback_type && !VALID_FEEDBACK_TYPES.includes(feedback_type)) {
            return NextResponse.json(
                { error: "Invalid feedback type" },
                { status: 400 }
            );
        }

        // Cap page_url length
        if (page_url && typeof page_url === "string") {
            page_url = page_url.slice(0, 2000);
        }

        if (!description || typeof description !== "string" || !description.trim()) {
            return NextResponse.json(
                { error: "Description is required" },
                { status: 400 }
            );
        }

        // Sanitize inputs
        description = description.slice(0, 5000);
        if (email && typeof email === "string") {
            email = email.slice(0, 254);
        }
        if (user_agent && typeof user_agent === "string") {
            user_agent = user_agent.replace(/[\x00-\x1f]/g, "").slice(0, 500);
        }
        if (screen_size && typeof screen_size === "string") {
            if (!/^\d{1,5}x\d{1,5}$/.test(screen_size)) {
                screen_size = null;
            }
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

        // Append bug reports to BUGS.md in the repo (fire-and-forget — don't block the response)
        if (feedback_type === "bug" || !feedback_type) {
            appendBugToTracker(description.trim(), page_url || "", email?.trim() || null).catch(
                (err) => console.error("Failed to update BUGS.md:", err)
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
