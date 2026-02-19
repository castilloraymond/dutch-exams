"use client";

import Link from "next/link";
import { Lock, ShieldCheck, ArrowLeft } from "lucide-react";

interface PremiumGateProps {
  backHref: string;
  backLabel: string;
}

export function PremiumGate({ backHref, backLabel }: PremiumGateProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--cream)] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
          <Lock className="h-8 w-8 text-[var(--accent)]" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)] mb-2">
            Founding Member Content
          </h1>
          <p className="text-[var(--ink)]/60">
            This exercise is available to Founding Members. Get lifetime access
            to all 46 mock exams, writing tasks, and speaking exercises.
          </p>
        </div>

        <Link
          href="/upgrade"
          className="cta-primary inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white"
        >
          Get Founding Member Access
        </Link>

        <div className="flex items-center justify-center gap-2 text-sm text-[var(--ink)]/50">
          <ShieldCheck className="h-4 w-4" />
          <span>One-time payment &middot; Pass or get a refund</span>
        </div>

        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
    </main>
  );
}
