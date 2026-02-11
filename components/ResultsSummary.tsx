"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, RotateCcw, ArrowLeft, ChevronDown, ChevronUp, ArrowRight, BookOpen, Headphones, Landmark, Crown } from "lucide-react";
import type { AnswerRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

const LABELS = ["A", "B", "C", "D"];

export interface SuggestedExam {
  id: string;
  title: string;
  module: "lezen" | "knm" | "luisteren";
  difficulty: string;
  href: string;
}

interface ResultsSummaryProps {
  title: string;
  correctAnswers: number;
  totalQuestions: number;
  elapsedTime?: number;
  answerRecords?: AnswerRecord[];
  onRetry: () => void;
  backHref?: string;
  backLabel?: string;
  suggestedExams?: SuggestedExam[];
  allModulesCompleted?: boolean;
}

const MODULE_ICONS = {
  lezen: BookOpen,
  knm: Landmark,
  luisteren: Headphones,
};

export function ResultsSummary({
  title,
  correctAnswers,
  totalQuestions,
  elapsedTime,
  answerRecords = [],
  onRetry,
  backHref = "/learn",
  backLabel = "Back to Modules",
  suggestedExams = [],
  allModulesCompleted = false,
}: ResultsSummaryProps) {
  const [showReview, setShowReview] = useState(false);
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const isPassing = percentage >= 60;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-[var(--cream)]">
      <div className="landing-card w-full max-w-2xl p-6 sm:p-8 text-center space-y-6">
        <div className="mx-auto mb-4 text-7xl">
          {isPassing ? "🎉" : "💪"}
        </div>

        <h2 className="text-2xl font-bold text-[var(--ink)]">
          {isPassing ? "Congratulations!" : "Keep practicing!"}
        </h2>

        <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
          Exam Result
        </span>

        <div>
          <p className="text-4xl font-bold text-[var(--ink)] mb-2">
            {correctAnswers} / {totalQuestions}
          </p>
          <p className="text-[var(--ink)]/60">
            {percentage}% correct on &ldquo;{title}&rdquo;
          </p>
          {elapsedTime !== undefined && (
            <p className="text-sm text-[var(--ink)]/50 mt-1">
              Time: {formatTime(elapsedTime)}
            </p>
          )}
          <p
            className={`mt-2 text-sm font-semibold ${
              isPassing ? "text-[var(--green)]" : "text-[#ef4444]"
            }`}
          >
            {isPassing ? "PASSED" : "NOT PASSED"}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={onRetry}
            className="w-full py-3 px-4 rounded-lg border-2 border-[var(--ink)]/20 text-[var(--ink)] font-medium hover:border-[var(--ink)]/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <Link href={backHref} className="block cursor-pointer">
            <button className="cta-primary w-full py-3 flex items-center justify-center gap-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </button>
          </Link>
        </div>
      </div>

      {/* Next Steps Section */}
      {suggestedExams.length > 0 && !allModulesCompleted && (
        <div className="w-full max-w-2xl mt-6">
          <div className="landing-card p-6">
            <h3 className="font-semibold text-[var(--ink)] mb-4">
              Continue Practicing
            </h3>
            <p className="text-sm text-[var(--ink)]/60 mb-4">
              Try these exams to prepare:
            </p>
            <div className="space-y-3">
              {suggestedExams.slice(0, 3).map((exam) => {
                const Icon = MODULE_ICONS[exam.module];
                return (
                  <Link
                    key={exam.id}
                    href={exam.href}
                    className="flex items-center gap-4 p-4 rounded-lg border border-[var(--ink)]/10 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--ink)] truncate">
                        {exam.title}
                      </p>
                      <p className="text-xs text-[var(--ink)]/50">
                        {exam.difficulty} level
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--ink)]/40" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* All Completed - Congratulations */}
      {allModulesCompleted && (
        <div className="w-full max-w-2xl mt-6">
          <div className="landing-card p-6 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent)]/10 border-2 border-[var(--accent)]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[var(--ink)] text-lg mb-2">
                  Congratulations! You completed all available exams!
                </h3>
                <p className="text-sm text-[var(--ink)]/70 mb-4">
                  More practice exams are coming soon. Have questions or feedback?
                </p>
                <Link href="/contact" className="cta-primary py-3 px-6 cursor-pointer inline-flex items-center gap-2">
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Answer Review Section */}
      {answerRecords.length > 0 && (
        <div className="w-full max-w-2xl mt-6">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full landing-card p-4 flex items-center justify-between text-left hover:bg-[var(--ink)]/5 transition-colors cursor-pointer"
          >
            <span className="font-semibold text-[var(--ink)]">
              Review Your Answers
            </span>
            {showReview ? (
              <ChevronUp className="h-5 w-5 text-[var(--ink)]/60" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[var(--ink)]/60" />
            )}
          </button>

          {showReview && (
            <div className="mt-2 space-y-3">
              {answerRecords.map((record, idx) => {
                const isCorrect = record.userAnswer === record.correctAnswer;
                const hasAnswer = record.userAnswer !== null;

                return (
                  <div
                    key={record.questionId}
                    className={cn(
                      "landing-card p-4 border-l-4",
                      isCorrect
                        ? "border-l-[var(--green)]"
                        : "border-l-[#ef4444]"
                    )}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-sm font-medium text-[var(--ink)]/60">
                        {idx + 1}.
                      </span>
                      <p className="flex-1 text-[var(--ink)] font-medium">
                        {record.questionText}
                      </p>
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-[var(--green)] flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-[#ef4444] flex-shrink-0" />
                      )}
                    </div>

                    <div className="ml-6 space-y-2 text-sm">
                      {hasAnswer ? (
                        <p>
                          <span className="text-[var(--ink)]/60">Your answer: </span>
                          <span
                            className={cn(
                              "font-medium",
                              isCorrect ? "text-[var(--green)]" : "text-[#ef4444]"
                            )}
                          >
                            {LABELS[record.userAnswer!]}. {record.options[record.userAnswer!]}
                          </span>
                        </p>
                      ) : (
                        <p className="text-[#ef4444]">
                          Not answered
                        </p>
                      )}

                      {!isCorrect && (
                        <p>
                          <span className="text-[var(--ink)]/60">Correct answer: </span>
                          <span className="font-medium text-[var(--green)]">
                            {LABELS[record.correctAnswer]}. {record.options[record.correctAnswer]}
                          </span>
                        </p>
                      )}

                      {record.explanation && (
                        <p className="text-[var(--ink)]/70 mt-2 pt-2 border-t border-[var(--ink)]/10">
                          <span className="font-medium">Explanation: </span>
                          {record.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
