"use client";

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
              "w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 bg-white",
              selectedAnswer === index
                ? "border-[var(--landing-orange)] bg-[var(--landing-orange)]/5"
                : "border-[var(--landing-navy)]/10 hover:border-[var(--landing-navy)]/30"
            )}
          >
            <span
              className={cn(
                "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold",
                selectedAnswer === index
                  ? "bg-[var(--landing-orange)] text-white"
                  : "bg-[var(--landing-navy)]/10 text-[var(--landing-navy)]"
              )}
            >
              {LABELS[index]}
            </span>
            <span className="pt-0.5 text-[var(--landing-navy)]">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
