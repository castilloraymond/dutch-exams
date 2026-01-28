"use client";

import { useState } from "react";
import type { Question, ExamMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface ExamQuestionPanelProps {
  question: Question;
  mode: ExamMode;
  isLast: boolean;
  onAnswer: (isCorrect: boolean) => void;
}

const LABELS = ["A", "B", "C", "D"];

export function ExamQuestionPanel({ question, mode, isLast, onAnswer }: ExamQuestionPanelProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selectedIndex === question.correctIndex;

  const handleCheck = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  const handleExamSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleExamNext = () => {
    if (selectedIndex === null) return;
    onAnswer(selectedIndex === question.correctIndex);
  };

  if (mode === "exam") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[var(--landing-navy)]">{question.text}</h3>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleExamSelect(index)}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 bg-white",
                selectedIndex === index
                  ? "border-[var(--landing-orange)] bg-[var(--landing-orange)]/5"
                  : "border-[var(--landing-navy)]/10 hover:border-[var(--landing-navy)]/30"
              )}
            >
              <span className={cn(
                "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold",
                selectedIndex === index
                  ? "bg-[var(--landing-orange)] text-white"
                  : "bg-[var(--landing-navy)]/10 text-[var(--landing-navy)]"
              )}>
                {LABELS[index]}
              </span>
              <span className="pt-0.5 text-[var(--landing-navy)]">{option}</span>
            </button>
          ))}
        </div>
        <div className="pt-4">
          <button
            onClick={handleExamNext}
            disabled={selectedIndex === null}
            className="cta-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLast ? "Submit Exam" : "Next"}
          </button>
        </div>
      </div>
    );
  }

  // Practice mode: check answer, show feedback, then next
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[var(--landing-navy)]">{question.text}</h3>
      <div className="space-y-2">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrectOption = index === question.correctIndex;
          return (
            <button
              key={index}
              onClick={() => !submitted && setSelectedIndex(index)}
              disabled={submitted}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 bg-white",
                !submitted && isSelected && "border-[var(--landing-orange)] bg-[var(--landing-orange)]/5",
                !submitted && !isSelected && "border-[var(--landing-navy)]/10 hover:border-[var(--landing-navy)]/30",
                submitted && isCorrectOption && "border-[var(--landing-green)] bg-[var(--landing-green)]/10",
                submitted && isSelected && !isCorrectOption && "border-[var(--landing-red)] bg-[var(--landing-red)]/10",
                submitted && !isSelected && !isCorrectOption && "border-[var(--landing-navy)]/10 opacity-60"
              )}
            >
              <span className={cn(
                "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold",
                submitted && isCorrectOption ? "bg-[var(--landing-green)] text-white" :
                submitted && isSelected && !isCorrectOption ? "bg-[var(--landing-red)] text-white" :
                isSelected ? "bg-[var(--landing-orange)] text-white" :
                "bg-[var(--landing-navy)]/10 text-[var(--landing-navy)]"
              )}>
                {LABELS[index]}
              </span>
              <span className="pt-0.5 flex-1 text-[var(--landing-navy)]">{option}</span>
              {submitted && isCorrectOption && (
                <CheckCircle2 className="h-5 w-5 text-[var(--landing-green)] flex-shrink-0 mt-0.5" />
              )}
              {submitted && isSelected && !isCorrectOption && (
                <XCircle className="h-5 w-5 text-[var(--landing-red)] flex-shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {submitted && question.explanation && (
        <div className="landing-card p-4 bg-[var(--landing-navy)]/5">
          <p className="text-sm text-[var(--landing-navy)]">
            <span className="font-medium">Explanation: </span>
            {question.explanation}
          </p>
        </div>
      )}

      <div className="pt-4">
        {!submitted ? (
          <button
            onClick={handleCheck}
            disabled={selectedIndex === null}
            className="cta-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : (
          <button onClick={handleNext} className="cta-primary w-full py-3">
            {isCorrect ? "Continue" : "Got it, Next Question"}
          </button>
        )}
      </div>
    </div>
  );
}
