import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 503 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
    });

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user details from Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    // Check if already premium via Clerk publicMetadata
    if (clerkUser.publicMetadata?.isPremium === true) {
      return NextResponse.json(
        { error: "You already have Pro access" },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: email!,
      metadata: {
        clerk_user_id: userId,
      },
      custom_text: {
        submit: {
          message:
            "Your Pro Access includes:\n✓ 1,200+ Drill Questions\n✓ All 5 Exam Modules\n✓ 71 Mock Exams (A1, A2 & B1)\n✓ All future updates (new exams, AI explanations & more)\n✓ 7-day money-back guarantee — no questions asked",
        },
      },
      success_url: `${origin}/learn?upgraded=true`,
      cancel_url: `${origin}/upgrade`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Stripe checkout error:", message);
    return NextResponse.json(
      { error: `Failed to create checkout session: ${message}` },
      { status: 500 }
    );
  }
}
