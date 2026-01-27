import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate email
        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
