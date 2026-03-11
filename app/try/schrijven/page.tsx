"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  Lock,
  Lightbulb,
  Mail,
  ArrowRight,
} from "lucide-react";
import { getQuickAssessmentWritingTask, getQuickAssessmentModules } from "@/lib/content";
import { useUser } from "@clerk/nextjs";
import { WritingInput } from "@/components/schrijven/WritingInput";
import { ExamHeader } from "@/components/ExamHeader";
import { ExamBottomNav } from "@/components/ExamBottomNav";
import { QuestionGrid } from "@/components/QuestionGrid";

type Stage = "writing" | "results";

const STORAGE_KEY = "quick-assessment-schrijven-result";

export default function SchrijvenTrialPage() {
  const router = useRouter();
  const { user } = useUser();

  const task = useMemo(() => getQuickAssessmentWritingTask(), []);
  const moduleInfo = useMemo(
    () => getQuickAssessmentModules().find((m) => m.module === "schrijven"),
    []
  );

  const [stage, setStage] = useState<Stage>("writing");
  const [submission, setSubmission] = useState("");
  const [startTime] = useState(() => Date.now());
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [showGrid, setShowGrid] = useState(false);

  // Check completed assessment
  useEffect(() => {
    const hasCompletedResult = localStorage.getItem(STORAGE_KEY);
    if (hasCompletedResult) {
      router.push("/learn/schrijven");
    }
  }, [router]);

  const handleSubmit = useCallback(() => {
    // Save result to localStorage and go directly to results
    const result = {
      module: "schrijven",
      submission,
      totalTimeMs: Date.now() - startTime,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    setStage("results");
  }, [submission, startTime]);

  const isSubmitDisabled = submission.trim().length < 10;
  const isUnlocked = !!user;

  const toggleBookmark = useCallback(() => {
    if (!task) return;
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(task.id)) next.delete(task.id);
      else next.add(task.id);
      return next;
    });
  }, [task]);

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-[var(--ink)]">Opdracht niet gevonden</div>
      </div>
    );
  }

  const questionIds = [task.id];
  const answeredSet = useMemo(() => {
    const set = new Set<string>();
    if (submission.trim().length > 0) set.add(task.id);
    return set;
  }, [submission, task.id]);

  const title = moduleInfo?.name
    ? `${moduleInfo.name} Trial`
    : "Schrijven Trial";

  return (
    <main className="min-h-screen flex flex-col">
      {stage === "writing" ? (
        <>
          <ExamHeader
            title={title}
            startTime={startTime}
            backHref="/try"
          />

          <section className="flex-1 bg-[var(--cream)] overflow-y-auto p-4 sm:p-6 pb-24">
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Scenario */}
              <div className="landing-card p-4 bg-[var(--ink)]/5">
                <p className="text-[var(--ink)]">{task.scenario}</p>
              </div>

              {/* Prompt */}
              <p className="font-semibold text-[var(--ink)] whitespace-pre-line">
                {task.prompt}
              </p>

              {/* Writing input */}
              <WritingInput
                value={submission}
                onChange={setSubmission}
                placeholder="Schrijf hier je antwoord..."
                wordRange={task.wordRange}
              />
            </div>
          </section>

          <ExamBottomNav
            currentIndex={0}
            totalQuestions={1}
            isBookmarked={bookmarked.has(task.id)}
            onPrevious={() => {}}
            onNext={() => {}}
            onOpenGrid={() => setShowGrid(true)}
            onToggleBookmark={toggleBookmark}
            onSubmit={isSubmitDisabled ? () => {} : handleSubmit}
          />

          {showGrid && (
            <QuestionGrid
              totalQuestions={1}
              currentIndex={0}
              answeredQuestions={answeredSet}
              bookmarkedQuestions={bookmarked}
              questionIds={questionIds}
              onSelectQuestion={() => setShowGrid(false)}
              onClose={() => setShowGrid(false)}
            />
          )}
        </>
      ) : (
        /* Results Stage */
        <div className="min-h-screen flex flex-col bg-[var(--cream)]">
          <ExamHeader
            title={title}
            startTime={startTime}
            backHref="/try"
          />

          <section className="flex-1 container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Side-by-side answer comparison */}
              <div className="rounded-xl shadow-lg p-4 bg-white">
                <h3 className="font-bold text-[var(--ink)] mb-3">
                  Compare Your Answer
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {/* User's answer */}
                  <div className="p-3 rounded-lg bg-[var(--ink)]/5">
                    <h4 className="text-sm font-medium text-[var(--ink)]/60 mb-2">
                      Your answer:
                    </h4>
                    <p className="text-[var(--ink)] whitespace-pre-wrap text-sm">
                      {submission}
                    </p>
                  </div>

                  {/* Model answer */}
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <h4 className="text-sm font-medium text-green-700 mb-2">
                      Example answer:
                    </h4>
                    <p className="text-[var(--ink)] whitespace-pre-wrap text-sm">
                      {task.modelAnswer as string}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Feedback teaser */}
              <div className="rounded-xl shadow-lg p-4 bg-gradient-to-r from-[var(--ink)] to-[var(--ink)]/90">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">
                      Want AI feedback on your writing?
                    </h3>
                    <p className="text-white/80 text-sm mb-3">
                      Get your writing analyzed for spelling, grammar, and word choice.
                    </p>
                    <Link
                      href="/auth/signup?redirect=/try/schrijven"
                      className="inline-block bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                      Sign up to unlock
                    </Link>
                  </div>
                </div>
              </div>

              {/* Tips section */}
              <div className="rounded-xl shadow-lg p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-[var(--accent)]" />
                  <h3 className="font-bold text-[var(--ink)] text-sm">Quick Tips</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.tips.map((tip, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--ink)]/5 text-xs text-[var(--ink)]"
                    >
                      <Check className="h-3 w-3 text-green-500" />
                      {tip}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              {isUnlocked ? (
                <div className="rounded-xl shadow-lg p-4 bg-gradient-to-r from-[var(--accent)]/5 to-[var(--accent)]/10">
                  <h3 className="font-semibold text-[var(--ink)] mb-1">
                    Ready to practice more?
                  </h3>
                  <p className="text-sm text-[var(--ink)]/60 mb-3">
                    Try more writing tasks to prepare for the real exam.
                  </p>
                  <Link
                    href="/learn/schrijven"
                    className="inline-flex items-center gap-2 cta-primary px-5 py-2.5 text-white rounded-lg font-semibold text-sm"
                  >
                    Practice More Writing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center">
                    <h3 className="font-semibold text-[var(--ink)] mb-1 text-sm">
                      Save your progress & get AI feedback
                    </h3>
                    <p className="text-xs text-[var(--ink)]/60">
                      Create a free account to continue learning
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href="/auth/signup?redirect_url=/try/schrijven"
                      className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-[var(--ink)] text-white rounded-full font-medium hover:bg-[var(--ink)]/90 transition-colors text-sm"
                    >
                      <Mail className="h-4 w-4" />
                      Sign up
                    </Link>

                    <p className="text-center text-xs text-[var(--ink)]/50">
                      Already have an account?{" "}
                      <Link
                        href="/auth/login?redirect_url=/try/schrijven"
                        className="text-[var(--accent)] hover:underline"
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
