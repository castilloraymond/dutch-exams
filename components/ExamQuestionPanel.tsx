"use client";

import { useEffect } from "react";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ExamQuestionPanelProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
}

const LABELS = ["A", "B", "C", "D"];

export function ExamQuestionPanel({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
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
      <div className="text-sm font-medium text-[var(--landing-navy)]/60">
        Vraag {questionNumber}
      </div>

      <h3 className="text-lg font-medium text-[var(--landing-navy)]">{question.text}</h3>

      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(index)}
            className={cn(
              "w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer",
              selectedAnswer === index
                ? "border-[var(--landing-orange)] bg-[var(--landing-orange)] text-white"
                : "bg-white border-[var(--landing-navy)]/10 hover:border-[var(--landing-navy)]/30"
            )}
          >
            <span
              className={cn(
                "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold",
                selectedAnswer === index
                  ? "bg-white text-[var(--landing-orange)]"
                  : "bg-[var(--landing-navy)]/10 text-[var(--landing-navy)]"
              )}
            >
              {LABELS[index]}
            </span>
            <span className={cn(
              "pt-0.5",
              selectedAnswer === index ? "text-white" : "text-[var(--landing-navy)]"
            )}>
              {option}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
