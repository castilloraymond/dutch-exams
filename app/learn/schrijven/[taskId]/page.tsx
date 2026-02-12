"use client";

import { useState, useEffect, useMemo, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, PenLine } from "lucide-react";
import { getWritingTask } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";
import type { FormAnswer, WritingAttempt, WritingQuestion, WritingSubmission } from "@/lib/types";
import { WritingInput } from "@/components/schrijven/WritingInput";
import { FormInput } from "@/components/schrijven/FormInput";
import { WritingResults } from "@/components/schrijven/WritingResults";

type Stage = "writing" | "results";

interface PageProps {
  params: Promise<{ taskId: string }>;
}

export default function SchrijvenTaskPage({ params }: PageProps) {
  const { taskId } = use(params);
  const router = useRouter();
  const { saveWritingAttempt } = useProgress();

  const task = useMemo(() => getWritingTask(taskId), [taskId]);

  // Build questions array from task.questions or fallback to single legacy question
  const questions: WritingQuestion[] = useMemo(() => {
    if (!task) return [];
    if (task.questions && task.questions.length > 0) return task.questions;
    // Legacy single-question fallback
    return [
      {
        id: `${task.id}-q1`,
        scenario: task.scenario,
        scenarioEn: task.scenarioEn,
        prompt: task.prompt,
        promptEn: task.promptEn,
        taskType: task.taskType,
        wordRange: task.wordRange,
        formFields: task.formFields,
        selfAssessmentCriteria: task.selfAssessmentCriteria,
        modelAnswer: task.modelAnswer,
      },
    ];
  }, [task]);

  const isMultiQuestion = questions.length > 1;

  const [stage, setStage] = useState<Stage>("writing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submission, setSubmission] = useState<string | FormAnswer>("");
  const [submissions, setSubmissions] = useState<WritingSubmission[]>([]);
  const [startTime] = useState(() => Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [checkedCriteria, setCheckedCriteria] = useState<string[]>([]);
  const [modelAnswerRevealed, setModelAnswerRevealed] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Reset submission when question changes
  useEffect(() => {
    if (!currentQuestion) return;
    setSubmission(currentQuestion.taskType === "form" ? {} : "");
  }, [currentQuestionIndex, currentQuestion]);

  // Timer effect
  useEffect(() => {
    if (stage !== "writing") return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, stage]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (isMultiQuestion) {
      // Save this submission
      setSubmissions((prev) => [
        ...prev,
        { questionId: currentQuestion.id, submission },
      ]);

      // If more questions, advance
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        return;
      }
    }

    // Last question or single: go to results
    setStage("results");
  };

  const handleRevealModelAnswer = () => {
    setModelAnswerRevealed(true);
  };

  const handleComplete = useCallback(() => {
    if (!task) return;

    const allSubmissions: WritingSubmission[] = isMultiQuestion
      ? [...submissions, { questionId: currentQuestion.id, submission }]
      : [];

    const attempt: WritingAttempt = {
      submission: isMultiQuestion ? allSubmissions[0]?.submission || "" : submission,
      submissions: isMultiQuestion ? allSubmissions : undefined,
      selfAssessmentScore: checkedCriteria.length,
      selfAssessmentTotal: task.selfAssessmentCriteria.length,
      checkedCriteria,
      modelAnswerRevealed,
      completedAt: new Date().toISOString(),
      timeElapsed: elapsedTime,
    };

    saveWritingAttempt(taskId, attempt);
  }, [task, isMultiQuestion, submissions, currentQuestion, submission, checkedCriteria, modelAnswerRevealed, elapsedTime, saveWritingAttempt, taskId]);

  const handleRetry = () => {
    setStage("writing");
    setCurrentQuestionIndex(0);
    setSubmission(questions[0]?.taskType === "form" ? {} : "");
    setSubmissions([]);
    setCheckedCriteria([]);
    setModelAnswerRevealed(false);
  };

  const isSubmitDisabled = useMemo(() => {
    if (!currentQuestion) return true;
    if (currentQuestion.taskType === "form") {
      const formSubmission = submission as FormAnswer;
      const requiredFields = currentQuestion.formFields?.filter((f) => f.required) || [];
      return requiredFields.some((field) => !formSubmission[field.id]?.trim());
    }
    return (submission as string).trim().length < 10;
  }, [currentQuestion, submission]);

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-[var(--ink)]">Opdracht niet gevonden</div>
      </div>
    );
  }

  // Build all submissions for results (including current)
  const allSubmissions: WritingSubmission[] = isMultiQuestion
    ? [...submissions, { questionId: currentQuestion?.id || "", submission }]
    : [{ questionId: questions[0]?.id || "", submission }];

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      {/* Header */}
      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/learn/schrijven"
                className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <PenLine className="h-5 w-5 text-[var(--accent)]" />
                <h1 className="text-lg font-bold text-[var(--ink)]">
                  {task.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isMultiQuestion && stage === "writing" && (
                <span className="text-sm font-medium text-[var(--ink)]/60">
                  Question {currentQuestionIndex + 1}/{questions.length}
                </span>
              )}
              {stage === "writing" && (
                <div className="flex items-center gap-2 text-[var(--ink)]/60">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Multi-question progress bar */}
      {isMultiQuestion && stage === "writing" && (
        <div className="bg-[var(--cream)] px-4 pt-2">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <div className="w-full h-1.5 bg-[var(--ink)]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
                  style={{
                    width: `${(currentQuestionIndex / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {stage === "writing" && currentQuestion && (
            <div className="space-y-6">
              {/* Scenario */}
              <div className="landing-card p-4 bg-[var(--ink)]/5">
                <p className="text-[var(--ink)]">{currentQuestion.scenario}</p>
              </div>

              {/* Prompt */}
              <div>
                <h2 className="font-bold text-[var(--ink)] mb-2">
                  {currentQuestion.prompt}
                </h2>
              </div>

              {/* Input area */}
              {currentQuestion.taskType === "form" ? (
                <FormInput
                  fields={currentQuestion.formFields || []}
                  value={submission as FormAnswer}
                  onChange={setSubmission}
                />
              ) : (
                <WritingInput
                  value={submission as string}
                  onChange={(val) => setSubmission(val)}
                  placeholder="Schrijf hier je antwoord..."
                  wordRange={currentQuestion.wordRange}
                />
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {isMultiQuestion && currentQuestionIndex < questions.length - 1
                  ? "Volgende vraag"
                  : "Versturen"}
              </button>
            </div>
          )}

          {stage === "results" && (
            <WritingResults
              task={task}
              submission={submission}
              questions={questions}
              submissions={allSubmissions}
              checkedCriteria={checkedCriteria}
              elapsedTime={elapsedTime}
              modelAnswerRevealed={modelAnswerRevealed}
              onRevealModelAnswer={handleRevealModelAnswer}
              onRetry={handleRetry}
              onComplete={handleComplete}
              onGoToIndex={() => router.push('/learn/schrijven')}
            />
          )}
        </div>
      </section>
    </main>
  );
}
