"use client";

import { useState, useEffect } from "react";
import { Check, Lightbulb, Clock, ListChecks, ChevronDown, ChevronUp } from "lucide-react";
import type { WritingTask, WritingQuestion, WritingSubmission, FormAnswer } from "@/lib/types";

interface WritingResultsProps {
  task: WritingTask;
  submission: string | FormAnswer;
  questions?: WritingQuestion[];
  submissions?: WritingSubmission[];
  checkedCriteria: string[];
  elapsedTime: number;
  modelAnswerRevealed: boolean;
  onRevealModelAnswer: () => void;
  onRetry: () => void;
  onComplete: () => void;
  onGoToIndex: () => void;
  goToIndexLabel?: string;
}

function AnswerComparison({
  taskType,
  userAnswer,
  modelAnswer,
}: {
  taskType: string;
  userAnswer: string | FormAnswer;
  modelAnswer: string | FormAnswer;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-4 rounded-lg bg-[var(--ink)]/5">
        <h4 className="text-sm font-medium text-[var(--ink)]/60 mb-2">
          Your Answer:
        </h4>
        {taskType === "form" ? (
          <div className="space-y-1 text-sm">
            {Object.entries(userAnswer as FormAnswer).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium">{key}:</span> {value}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--ink)] whitespace-pre-wrap text-sm">
            {userAnswer as string}
          </p>
        )}
      </div>

      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
        <h4 className="text-sm font-medium text-green-700 mb-2">
          Model Answer:
        </h4>
        {taskType === "form" ? (
          <div className="space-y-1 text-sm">
            {Object.entries(modelAnswer as FormAnswer).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium">{key}:</span> {value}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--ink)] whitespace-pre-wrap text-sm">
            {modelAnswer as string}
          </p>
        )}
      </div>
    </div>
  );
}

export function WritingResults({
  task,
  submission,
  questions = [],
  submissions = [],
  elapsedTime,
  onRevealModelAnswer,
  onRetry,
  onComplete,
  onGoToIndex,
  goToIndexLabel = "Another Task",
}: WritingResultsProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);
  const isMultiQuestion = questions.length > 1;

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
        <div className="flex items-center justify-center gap-4 text-[var(--ink)]/60">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Time: {formatTime(elapsedTime)}</span>
          </div>
          {isMultiQuestion && (
            <span>{questions.length} questions completed</span>
          )}
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

      {/* Multi-question answers */}
      {isMultiQuestion ? (
        <div className="space-y-4">
          <h3 className="font-bold text-[var(--ink)]">
            Your Answers & Model Answers
          </h3>

          {questions.map((q, idx) => {
            const sub = submissions[idx];
            const userAnswer = sub?.submission || "";
            const isExpanded = expandedQuestion === idx;

            return (
              <div key={q.id} className="landing-card overflow-hidden">
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-sm font-medium text-[var(--accent)]">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-[var(--ink)]">
                      {q.prompt}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[var(--ink)]/60 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[var(--ink)]/60 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {/* Scenario context */}
                    <div className="p-3 rounded-lg bg-[var(--ink)]/5">
                      <p className="text-xs text-[var(--ink)]/60">{q.scenario}</p>
                    </div>

                    {/* Criteria for this question */}
                    {q.selfAssessmentCriteria.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-[var(--ink)]/60">Criteria:</p>
                        {q.selfAssessmentCriteria.map((c) => (
                          <div key={c.id} className="flex items-center gap-1.5 text-xs text-[var(--ink)]/70">
                            <Check className="h-3 w-3 text-[var(--accent)] flex-shrink-0" />
                            <span>{c.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <AnswerComparison
                      taskType={q.taskType}
                      userAnswer={userAnswer}
                      modelAnswer={q.modelAnswer}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Single question: original layout */
        <div className="landing-card p-6">
          <h3 className="font-bold text-[var(--ink)] mb-4">
            Model Answer
          </h3>
          <AnswerComparison
            taskType={task.taskType}
            userAnswer={submission}
            modelAnswer={task.modelAnswer}
          />
        </div>
      )}

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

      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetry}
          className="flex-1 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <button
          onClick={onGoToIndex}
          className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
        >
          {goToIndexLabel}
        </button>
      </div>
    </div>
  );
}
