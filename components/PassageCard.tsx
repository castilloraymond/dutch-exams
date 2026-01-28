"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import type { PassageSummary, PassageProgress } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

interface PassageCardProps {
  passage: PassageSummary;
  progress: PassageProgress | null;
}

export function PassageCard({ passage, progress }: PassageCardProps) {
  const questionsAnswered = progress?.questionsAnswered.length ?? 0;
  const totalQuestions = passage.questionCount;
  const progressPercent = (questionsAnswered / totalQuestions) * 100;
  const isCompleted = progress?.completed ?? false;

  return (
    <div className="landing-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-[var(--landing-navy)]">{passage.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-[var(--landing-navy)]/10 text-[var(--landing-navy)] rounded-full font-medium">
            {passage.difficulty}
          </span>
          {isCompleted && (
            <CheckCircle2 className="h-5 w-5 text-[var(--landing-green)]" />
          )}
        </div>
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <Progress value={progressPercent} className="h-2" />
          <p className="text-sm text-[var(--landing-navy)]/60">
            {questionsAnswered} / {totalQuestions} questions
            {progress?.correctAnswers !== undefined && questionsAnswered > 0 && (
              <span className="ml-2">
                ({progress.correctAnswers} correct)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/learn/lezen/${passage.id}?mode=practice`}
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-[var(--landing-navy)]/10 text-[var(--landing-navy)] hover:bg-[var(--landing-navy)]/20 transition-colors"
          >
            Practice
          </Link>
          <Link
            href={`/learn/lezen/${passage.id}?mode=exam`}
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-[var(--landing-orange)]/10 text-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/20 transition-colors"
          >
            Exam
          </Link>
        </div>
      </div>
    </div>
  );
}
