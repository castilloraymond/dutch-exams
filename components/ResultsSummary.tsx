"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, RotateCcw, ArrowLeft } from "lucide-react";
import type { ExamMode } from "@/lib/types";

interface ResultsSummaryProps {
  title: string;
  correctAnswers: number;
  totalQuestions: number;
  onRetry: () => void;
  backHref?: string;
  backLabel?: string;
  mode?: ExamMode;
}

export function ResultsSummary({
  title,
  correctAnswers,
  totalQuestions,
  onRetry,
  backHref = "/learn",
  backLabel = "Back to Passages",
  mode = "practice",
}: ResultsSummaryProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const isPassing = percentage >= 60;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--landing-cream)]">
      <div className="landing-card w-full max-w-md p-6 sm:p-8 text-center space-y-6">
        <div className="mx-auto mb-4">
          {isPassing ? (
            <CheckCircle2 className="h-16 w-16 text-[var(--landing-green)] mx-auto" />
          ) : (
            <XCircle className="h-16 w-16 text-[var(--landing-red)] mx-auto" />
          )}
        </div>

        <h2 className="text-2xl font-bold font-serif text-[var(--landing-navy)]">
          {isPassing ? "Great job!" : "Keep practicing!"}
        </h2>

        {mode === "exam" && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--landing-orange)]/10 text-[var(--landing-orange)]">
            Exam Result
          </span>
        )}

        <div>
          <p className="text-4xl font-bold text-[var(--landing-navy)] mb-2">
            {correctAnswers} / {totalQuestions}
          </p>
          <p className="text-[var(--landing-navy)]/60">
            {percentage}% correct on &ldquo;{title}&rdquo;
          </p>
          {mode === "exam" && (
            <p className={`mt-2 text-sm font-semibold ${isPassing ? "text-[var(--landing-green)]" : "text-[var(--landing-red)]"}`}>
              {isPassing ? "GESLAAGD (Passed)" : "NIET GESLAAGD (Not passed)"}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={onRetry}
            className="w-full py-3 px-4 rounded-lg border-2 border-[var(--landing-navy)]/20 text-[var(--landing-navy)] font-medium hover:border-[var(--landing-navy)]/40 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <Link href={backHref} className="block">
            <button className="cta-primary w-full py-3 flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
