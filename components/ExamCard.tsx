"use client";

import Link from "next/link";
import { Clock, FileText, ChevronRight, CheckCircle2 } from "lucide-react";
import type { MockExamSummary } from "@/lib/types";

interface ExamCardProps {
  exam: MockExamSummary;
  href: string;
  completed?: boolean;
  lastScore?: number;
}

export function ExamCard({ exam, href, completed, lastScore }: ExamCardProps) {
  const difficultyColor = exam.difficulty === "A1"
    ? "bg-[var(--landing-green)]/10 text-[var(--landing-green)]"
    : "bg-[var(--landing-orange)]/10 text-[var(--landing-orange)]";

  return (
    <Link href={href}>
      <div className="landing-card p-4 hover:shadow-md transition-shadow cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${difficultyColor}`}>
                {exam.difficulty}
              </span>
              {completed && (
                <span className="flex items-center gap-1 text-xs text-[var(--landing-green)]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {lastScore !== undefined && `${lastScore}%`}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-[var(--landing-navy)] group-hover:text-[var(--landing-orange)] transition-colors">
              {exam.title}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-xs text-[var(--landing-navy)]/60">
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {exam.questionCount} vragen
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {exam.recommendedTime}
              </span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[var(--landing-navy)]/30 group-hover:text-[var(--landing-orange)] transition-colors" />
        </div>
      </div>
    </Link>
  );
}
