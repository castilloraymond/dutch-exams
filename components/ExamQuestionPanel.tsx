"use client";

import { useEffect } from "react";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ExamQuestionPanelProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
  hideQuestionText?: boolean;
}

const LABELS = ["A", "B", "C", "D"];

export function ExamQuestionPanel({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
  hideQuestionText = false,
}: ExamQuestionPanelProps) {
  // Keyboard shortcuts for selecting answers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const index = LABELS.indexOf(key);
      if (index !== -1 && index < question.options.length) {
        onSelectAnswer(index);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [question.options.length, onSelectAnswer]);

  return (
    <div className="space-y-4">
      {!hideQuestionText && (
        <>
          <div className="text-sm font-medium text-[var(--ink)]/60">
            Vraag {questionNumber}
          </div>
          <h3 className="text-lg font-medium text-[var(--ink)]">{question.text}</h3>
        </>
      )}

      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(index)}
            className={cn(
              "w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer",
              selectedAnswer === index
                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                : "bg-white border-[var(--ink)]/10 hover:border-[var(--ink)]/30"
            )}
          >
            <span
              className={cn(
                "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold",
                selectedAnswer === index
                  ? "bg-white text-[var(--accent)]"
                  : "bg-[var(--ink)]/10 text-[var(--ink)]"
              )}
            >
              {LABELS[index]}
            </span>
            <span className={cn(
              "pt-0.5",
              selectedAnswer === index ? "text-white" : "text-[var(--ink)]"
            )}>
              {option}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
