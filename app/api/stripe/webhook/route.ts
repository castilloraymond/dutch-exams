import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { PostHog } from "posthog-node";

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
      const userId = session.metadata?.clerk_user_id;

      if (!userId) {
        console.error("No clerk_user_id in session metadata");
        return NextResponse.json(
          { error: "Missing user ID" },
          { status: 400 }
        );
      }

      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          isPremium: true,
          stripeCustomerId: session.customer as string,
          stripePaymentIntentId: session.payment_intent as string,
          premiumSince: new Date().toISOString(),
        },
      });

      console.log("User upgraded to Pro");

      const phKey = process.env.POSTHOG_KEY;
      if (phKey) {
        const ph = new PostHog(phKey, { host: process.env.POSTHOG_HOST ?? "https://eu.i.posthog.com" });
        ph.capture({
          distinctId: userId,
          event: "purchase_completed",
          properties: {
            amount: session.amount_total ? session.amount_total / 100 : null,
            currency: session.currency,
          },
        });
        await ph.shutdown();
      }
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
