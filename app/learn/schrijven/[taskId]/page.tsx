"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, PenLine } from "lucide-react";
import { getWritingTask } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";
import type { FormAnswer, WritingAttempt } from "@/lib/types";
import { WritingInput } from "@/components/schrijven/WritingInput";
import { FormInput } from "@/components/schrijven/FormInput";
import { SelfAssessment } from "@/components/schrijven/SelfAssessment";
import { WritingResults } from "@/components/schrijven/WritingResults";

type Stage = "writing" | "self-assessment" | "results";

interface PageProps {
  params: Promise<{ taskId: string }>;
}

export default function SchrijvenTaskPage({ params }: PageProps) {
  const { taskId } = use(params);
  const router = useRouter();
  const { saveWritingAttempt } = useProgress();

  const task = useMemo(() => getWritingTask(taskId), [taskId]);

  const [stage, setStage] = useState<Stage>("writing");
  const [submission, setSubmission] = useState<string | FormAnswer>(
    task?.taskType === "form" ? {} : ""
  );
  const [startTime] = useState(() => Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [checkedCriteria, setCheckedCriteria] = useState<string[]>([]);
  const [modelAnswerRevealed, setModelAnswerRevealed] = useState(false);

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
    setStage("self-assessment");
  };

  const handleSelfAssessmentComplete = (criteria: string[]) => {
    setCheckedCriteria(criteria);
    setStage("results");
  };

  const handleRevealModelAnswer = () => {
    setModelAnswerRevealed(true);
  };

  const handleComplete = () => {
    if (!task) return;

    const attempt: WritingAttempt = {
      submission,
      selfAssessmentScore: checkedCriteria.length,
      selfAssessmentTotal: task.selfAssessmentCriteria.length,
      checkedCriteria,
      modelAnswerRevealed,
      completedAt: new Date().toISOString(),
      timeElapsed: elapsedTime,
    };

    saveWritingAttempt(taskId, attempt);
  };

  const handleRetry = () => {
    setStage("writing");
    setSubmission(task?.taskType === "form" ? {} : "");
    setCheckedCriteria([]);
    setModelAnswerRevealed(false);
  };

  const isSubmitDisabled = useMemo(() => {
    if (!task) return true;
    if (task.taskType === "form") {
      const formSubmission = submission as FormAnswer;
      const requiredFields = task.formFields?.filter((f) => f.required) || [];
      return requiredFields.some((field) => !formSubmission[field.id]?.trim());
    }
    return (submission as string).trim().length < 10;
  }, [task, submission]);

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--landing-cream)]">
        <div className="text-[var(--landing-navy)]">Opdracht niet gevonden</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
      {/* Header */}
      <header className="border-b border-[var(--landing-navy)]/10 sticky top-0 bg-[var(--landing-cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/learn/schrijven"
                className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <PenLine className="h-5 w-5 text-[var(--landing-orange)]" />
                <h1 className="text-lg font-bold font-sans-landing text-[var(--landing-navy)]">
                  {task.title}
                </h1>
              </div>
            </div>
            {stage === "writing" && (
              <div className="flex items-center gap-2 text-[var(--landing-navy)]/60">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {stage === "writing" && (
            <div className="space-y-6">
              {/* Scenario */}
              <div className="landing-card p-4 bg-[var(--landing-navy)]/5">
                <p className="text-[var(--landing-navy)] mb-2">{task.scenario}</p>
                <p className="text-sm text-[var(--landing-navy)]/60 italic">
                  {task.scenarioEn}
                </p>
              </div>

              {/* Prompt */}
              <div>
                <h2 className="font-bold text-[var(--landing-navy)] mb-2">
                  {task.prompt}
                </h2>
                <p className="text-sm text-[var(--landing-navy)]/60">
                  {task.promptEn}
                </p>
              </div>

              {/* Form reminder for form tasks */}
              {task.taskType === "form" && (
                <div className="bg-[var(--landing-orange)]/10 border border-[var(--landing-orange)]/30 rounded-lg p-4">
                  <p className="text-sm text-[var(--landing-navy)]">
                    <span className="font-semibold">Tip:</span> Op het echte examen
                    schrijf je met de hand op papier. Oefen ook je Nederlandse
                    handschrift!
                  </p>
                </div>
              )}

              {/* Input area */}
              {task.taskType === "form" ? (
                <FormInput
                  fields={task.formFields || []}
                  value={submission as FormAnswer}
                  onChange={setSubmission}
                />
              ) : (
                <WritingInput
                  value={submission as string}
                  onChange={(val) => setSubmission(val)}
                  placeholder="Schrijf hier je antwoord..."
                  wordRange={task.wordRange}
                />
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className="w-full bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Versturen
              </button>
            </div>
          )}

          {stage === "self-assessment" && (
            <SelfAssessment
              submission={submission}
              taskType={task.taskType}
              criteria={task.selfAssessmentCriteria}
              onComplete={handleSelfAssessmentComplete}
            />
          )}

          {stage === "results" && (
            <WritingResults
              task={task}
              submission={submission}
              checkedCriteria={checkedCriteria}
              elapsedTime={elapsedTime}
              modelAnswerRevealed={modelAnswerRevealed}
              onRevealModelAnswer={handleRevealModelAnswer}
              onRetry={handleRetry}
              onComplete={handleComplete}
            />
          )}
        </div>
      </section>
    </main>
  );
}
