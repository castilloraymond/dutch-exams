"use client";

import { ChevronLeft, ChevronRight, Grid3X3, Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamBottomNavProps {
  currentIndex: number;
  totalQuestions: number;
  isBookmarked: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onOpenGrid: () => void;
  onToggleBookmark: () => void;
  onSubmit: () => void;
}

export function ExamBottomNav({
  currentIndex,
  totalQuestions,
  isBookmarked,
  onPrevious,
  onNext,
  onOpenGrid,
  onToggleBookmark,
  onSubmit,
}: ExamBottomNavProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <div className="sticky bottom-0 z-10 bg-white border-t border-[var(--ink)]/10 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between max-w-4xl">
        {/* Previous button */}
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={cn(
            "flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
            isFirst
              ? "text-[var(--ink)]/30 cursor-not-allowed"
              : "text-[var(--ink)] hover:bg-[var(--ink)]/5 cursor-pointer"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">VORIGE</span>
        </button>

        {/* Center controls: Grid + Bookmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenGrid}
            className="p-2 rounded-lg text-[var(--ink)] hover:bg-[var(--ink)]/5 transition-colors cursor-pointer"
            title="Question overview"
          >
            <Grid3X3 className="h-5 w-5" />
          </button>

          <button
            onClick={onToggleBookmark}
            className={cn(
              "p-2 rounded-lg transition-colors cursor-pointer",
              isBookmarked
                ? "text-[var(--accent)] bg-[var(--accent)]/10"
                : "text-[var(--ink)] hover:bg-[var(--ink)]/5"
            )}
            title={isBookmarked ? "Remove bookmark" : "Bookmark question"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Next/Submit button + Progress */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--ink)]/60 hidden sm:inline">
            {currentIndex + 1} / {totalQuestions}
          </span>

          {isLast ? (
            <button
              onClick={onSubmit}
              className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 transition-colors cursor-pointer"
            >
              <span>INDIENEN</span>
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm text-[var(--ink)] hover:bg-[var(--ink)]/5 transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline">VOLGENDE</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
