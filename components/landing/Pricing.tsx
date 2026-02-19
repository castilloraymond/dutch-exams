"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/hooks/usePremium";

const SPOTS_TAKEN = 84;
const SPOTS_TOTAL = 100;

const features = [
  "1,200+ Drill Questions",
  "AI-Powered Explanations",
  "All 5 Exam Modules",
  "46 Full Mock Exams (A1, A2 & B1)",
  "Future Content Updates Included",
  "Private Feedback Channel",
];

export function PricingCard({ compact }: { compact?: boolean }) {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/auth/signup?redirect=/upgrade");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        setLoading(false);
      }
    } catch {
      console.error("Failed to create checkout session");
      setLoading(false);
    }
  };

  const spotsPercent = (SPOTS_TAKEN / SPOTS_TOTAL) * 100;

  return (
    <div className="bg-white rounded-[24px] p-8 sm:p-14 border-2 border-[#ebe8e0] relative overflow-hidden">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-glow)]" />

      {/* Limited badge */}
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
          <Flame className="h-3.5 w-3.5" />
          Limited Time
        </span>
      </div>

      {/* Spots progress */}
      <div className="max-w-[300px] mx-auto mb-8">
        <div className="flex justify-between text-xs text-[var(--ink-muted)] mb-1.5">
          <span>{SPOTS_TAKEN} of {SPOTS_TOTAL} spots taken</span>
          <span>{SPOTS_TOTAL - SPOTS_TAKEN} left</span>
        </div>
        <div className="w-full h-2 bg-[var(--ink)]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all"
            style={{ width: `${spotsPercent}%` }}
          />
        </div>
      </div>

      {/* Price */}
      <div className="text-center mb-2">
        <div className="text-sm text-[var(--ink-muted)] line-through mb-1">
          Regular Price: €149
        </div>
        <div className="text-[3.5rem] font-extrabold text-[var(--ink)] tracking-[-0.03em] leading-none">
          €49
        </div>
        <div className="text-[0.92rem] text-[var(--ink-muted)] mt-1">
          One-time payment &middot; Lifetime access
        </div>
      </div>

      {/* Features */}
      <div className={`grid grid-cols-1 ${compact ? "" : "sm:grid-cols-2"} gap-x-10 gap-y-3.5 text-left max-w-[520px] mx-auto my-8`}>
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2.5 text-[0.92rem] text-[var(--ink-soft)]">
            <Check className="h-4 w-4 text-[var(--green)] shrink-0" />
            {feature}
          </div>
        ))}
      </div>

      {/* CTA */}
      {isPremium ? (
        <div className="text-center text-[var(--green)] font-semibold">
          You&apos;re a Founding Member!
        </div>
      ) : (
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="cta-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-11 py-[18px] rounded-full font-semibold text-[1.05rem] disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Founding Member Access"}
        </button>
      )}

      {/* Guarantee */}
      <div className="mt-6 text-[0.85rem] text-[var(--ink-muted)] flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[var(--green)]" />
        Pass or get a full refund. No questions asked.
      </div>
    </div>
  );
}

export function Pricing() {
  return (
    <section className="py-[70px] px-6 lg:px-10 max-w-[900px] mx-auto text-center reveal" id="pricing">
      <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-4">
        Founding Member Pricing
      </div>
      <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-5 font-extrabold">
        Lock in lifetime access at our lowest price.
      </h2>
      <p className="text-[1.05rem] text-[var(--ink-soft)] leading-[1.7] mx-auto mb-[36px]">
        Less than the cost of one failed exam retake.
      </p>

      <PricingCard />
    </section>
  );
}
