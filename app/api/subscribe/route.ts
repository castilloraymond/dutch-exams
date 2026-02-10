import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
    try {
        // Rate limit: 5 requests per hour per IP
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        const { allowed, retryAfterMs } = rateLimit(`subscribe:${ip}`, 5, 60 * 60 * 1000);
        if (!allowed) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
            );
        }

        const body = await request.json();
        const { email } = body;

        // Validate email
        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Max length per RFC 5321
        if (email.length > 254) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // HTML5 spec-aligned email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Check if Supabase is configured
        if (!isSupabaseConfigured() || !supabase) {
            // In development without Supabase, just return success
            console.log("Subscriber (dev mode):", email);
            return NextResponse.json({
                success: true,
                message: "Thanks for subscribing! We'll be in touch soon.",
            });
        }

        // Insert into Supabase
        const { error } = await supabase
            .from("subscribers")
            .insert({ email: email.toLowerCase().trim() });

        if (error) {
            // Handle duplicate email
            if (error.code === "23505") {
                return NextResponse.json({
                    success: true,
                    message: "You're already on the list! We'll be in touch soon.",
                });
            }

            console.error("Supabase error:", error);
            return NextResponse.json(
                { error: "Failed to subscribe. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Thanks for subscribing! We'll be in touch soon.",
        });
    } catch (error) {
        console.error("Subscribe error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
