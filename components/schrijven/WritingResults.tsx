"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check, Lock, Lightbulb, Clock, ListChecks } from "lucide-react";
import type { WritingTask, FormAnswer } from "@/lib/types";

interface WritingResultsProps {
  task: WritingTask;
  submission: string | FormAnswer;
  checkedCriteria: string[];
  elapsedTime: number;
  modelAnswerRevealed: boolean;
  onRevealModelAnswer: () => void;
  onRetry: () => void;
  onComplete: () => void;
}

export function WritingResults({
  task,
  submission,
  elapsedTime,
  onRevealModelAnswer,
  onRetry,
  onComplete,
}: WritingResultsProps) {
  // Call onComplete and reveal model answer when component mounts
  useEffect(() => {
    onComplete();
    onRevealModelAnswer();
  }, [onComplete, onRevealModelAnswer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Time taken */}
      <div className="landing-card p-4">
        <div className="flex items-center justify-center gap-2 text-[var(--ink)]/60">
          <Clock className="h-4 w-4" />
          <span>Time: {formatTime(elapsedTime)}</span>
        </div>
      </div>

      {/* Requirements section */}
      <div className="landing-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ListChecks className="h-5 w-5 text-[var(--accent)]" />
          <h3 className="font-bold text-[var(--ink)]">
            What your answer should include
          </h3>
        </div>
        <ul className="space-y-2">
          {task.selfAssessmentCriteria.map((criterion) => (
            <li
              key={criterion.id}
              className="flex items-start gap-2 text-sm text-[var(--ink)]"
            >
              <Check className="h-4 w-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
              <span>{criterion.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Model answer section - shown by default */}
      <div className="landing-card p-6">
        <h3 className="font-bold text-[var(--ink)] mb-4">
          Model Answer
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* User's answer */}
          <div className="p-4 rounded-lg bg-[var(--ink)]/5">
            <h4 className="text-sm font-medium text-[var(--ink)]/60 mb-2">
              Your Answer:
            </h4>
            {task.taskType === "form" ? (
              <div className="space-y-1 text-sm">
                {Object.entries(submission as FormAnswer).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--ink)] whitespace-pre-wrap text-sm">
                {submission as string}
              </p>
            )}
          </div>

          {/* Model answer */}
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <h4 className="text-sm font-medium text-green-700 mb-2">
              Model Answer:
            </h4>
            {task.taskType === "form" ? (
              <div className="space-y-1 text-sm">
                {Object.entries(task.modelAnswer as FormAnswer).map(
                  ([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-[var(--ink)] whitespace-pre-wrap text-sm">
                {task.modelAnswer as string}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tips section */}
      <div className="landing-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-[var(--accent)]" />
          <h3 className="font-bold text-[var(--ink)]">Tips</h3>
        </div>
        <ul className="space-y-2">
          {task.tips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-[var(--ink)]"
            >
              <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        {/* Practical test-taking tips */}
        <div className="mt-4 pt-4 border-t border-[var(--ink)]/10">
          <p className="text-xs font-medium text-[var(--ink)]/70 mb-2">
            General exam tips:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-[var(--ink)]">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Keep sentences short and clear. Complex vocabulary does not earn extra points and increases your chance of making mistakes.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[var(--ink)]">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>On the real exam, you write by hand on paper. Practice your Dutch handwriting.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[var(--ink)]">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Always re-read your answer before submitting.</span>
            </li>
          </ul>
        </div>

        <p className="text-sm text-[var(--ink)]/60 mt-4 italic">
          Pro members get personalized tips based on their specific mistakes.
        </p>
      </div>

      {/* Locked AI Feedback section - Conversion hook #2 */}
      <div className="landing-card p-6 bg-gray-100 border-2 border-dashed border-gray-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <Lock className="h-4 w-4 text-gray-500" />
          </div>
          <h3 className="font-bold text-gray-500">AI Feedback</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)] text-white">
            Pro
          </span>
        </div>
        <div className="space-y-2 text-gray-400 text-sm">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
        <Link href="/upgrade" className="mt-4 block w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors text-center">
          Unlock with Pro
        </Link>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetry}
          className="flex-1 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/learn/schrijven"
          className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
        >
          Another Task
        </Link>
      </div>
    </div>
  );
}
