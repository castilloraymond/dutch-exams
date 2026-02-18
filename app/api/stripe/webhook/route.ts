import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 503 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
    });

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Admin client not configured" },
        { status: 503 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;

      if (!userId) {
        console.error("No supabase_user_id in session metadata");
        return NextResponse.json(
          { error: "Missing user ID" },
          { status: 400 }
        );
      }

      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          isPremium: true,
          stripeCustomerId: session.customer as string,
          premiumSince: new Date().toISOString(),
        },
      });

      if (error) {
        console.error("Failed to update user metadata:", error);
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 }
        );
      }

      console.log(`User ${userId} upgraded to Founding Member`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
