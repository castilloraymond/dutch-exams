"use client";

import { X, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionGridProps {
  totalQuestions: number;
  currentIndex: number;
  answeredQuestions: Set<string>;
  bookmarkedQuestions: Set<string>;
  questionIds: string[];
  onSelectQuestion: (index: number) => void;
  onClose: () => void;
}

export function QuestionGrid({
  totalQuestions,
  currentIndex,
  answeredQuestions,
  bookmarkedQuestions,
  questionIds,
  onSelectQuestion,
  onClose,
}: QuestionGridProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--landing-navy)]">
            Overzicht vragen
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--landing-navy)]/60 hover:bg-[var(--landing-navy)]/5 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs text-[var(--landing-navy)]/70">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-[var(--landing-green)]" />
            <span>Beantwoord</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-[var(--landing-navy)]/20" />
            <span>Onbeantwoord</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[var(--landing-orange)]" />
            <span>Gemarkeerd</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const questionId = questionIds[index];
            const isAnswered = questionId && answeredQuestions.has(questionId);
            const isBookmarked = questionId && bookmarkedQuestions.has(questionId);
            const isCurrent = index === currentIndex;

            return (
              <button
                key={index}
                onClick={() => {
                  onSelectQuestion(index);
                  onClose();
                }}
                className={cn(
                  "relative w-full aspect-square rounded-lg font-medium text-sm transition-all cursor-pointer",
                  "flex items-center justify-center",
                  isCurrent && "ring-2 ring-[var(--landing-navy)]",
                  isAnswered
                    ? "bg-[var(--landing-green)] text-white"
                    : "border-2 border-[var(--landing-navy)]/20 text-[var(--landing-navy)] hover:border-[var(--landing-navy)]/40"
                )}
              >
                {index + 1}
                {isBookmarked && (
                  <Star className="absolute -top-1 -right-1 w-3.5 h-3.5 text-[var(--landing-orange)] fill-[var(--landing-orange)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-[var(--landing-navy)]/10 text-sm text-[var(--landing-navy)]/70">
          <p>
            {answeredQuestions.size} van {totalQuestions} vragen beantwoord
          </p>
        </div>
      </div>
    </div>
  );
}
