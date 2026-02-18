import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendLoopsEvent } from "@/lib/loops";

const ALLOWED_EVENTS = [
  "quick_assessment_completed",
  "exercise_completed",
] as const;

type AllowedEvent = (typeof ALLOWED_EVENTS)[number];

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 20 events per minute per IP
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const { allowed, retryAfterMs } = rateLimit(
      `loops-event:${ip}`,
      20,
      60 * 1000
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
        }
      );
    }

    const body = await request.json();
    const { email, eventName, contactProperties } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate event name (whitelist)
    if (!eventName || !ALLOWED_EVENTS.includes(eventName as AllowedEvent)) {
      return NextResponse.json(
        { error: "Invalid event name" },
        { status: 400 }
      );
    }

    // Validate contactProperties is a plain object (if provided)
    if (
      contactProperties !== undefined &&
      (typeof contactProperties !== "object" ||
        contactProperties === null ||
        Array.isArray(contactProperties))
    ) {
      return NextResponse.json(
        { error: "Invalid contact properties" },
        { status: 400 }
      );
    }

    const success = await sendLoopsEvent({
      email,
      eventName,
      contactProperties,
    });

    if (!success) {
      return NextResponse.json(
        { error: "Failed to send event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Loops event error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
