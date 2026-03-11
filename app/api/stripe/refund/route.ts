import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
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

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const { isPremium, premiumSince, stripePaymentIntentId, stripeCustomerId } =
      clerkUser.publicMetadata as {
        isPremium?: boolean;
        premiumSince?: string;
        stripePaymentIntentId?: string;
        stripeCustomerId?: string;
      };

    if (!isPremium) {
      return NextResponse.json(
        { error: "No active subscription to refund" },
        { status: 400 }
      );
    }

    if (!premiumSince) {
      return NextResponse.json(
        { error: "Unable to process refund. Please contact support." },
        { status: 400 }
      );
    }

    const daysSincePurchase =
      (Date.now() - new Date(premiumSince).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSincePurchase > 7) {
      return NextResponse.json(
        { error: "Refund window has expired (7 days)" },
        { status: 400 }
      );
    }

    if (!stripePaymentIntentId) {
      return NextResponse.json(
        { error: "Unable to process refund. Please contact support." },
        { status: 400 }
      );
    }

    await stripe.refunds.create({
      payment_intent: stripePaymentIntentId,
    });

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        isPremium: false,
        stripeCustomerId,
        stripePaymentIntentId,
        premiumSince,
        refundedAt: new Date().toISOString(),
      },
    });

    console.log("User refunded");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Refund error:", error);
    return NextResponse.json(
      { error: "Refund failed. Please try again." },
      { status: 500 }
    );
  }
}
