"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  PenLine,
  Check,
  Lock,
  Lightbulb,
  Mail,
  ArrowRight,
} from "lucide-react";
import { getQuickAssessmentWritingTask, getQuickAssessmentModules } from "@/lib/content";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

type Stage = "writing" | "results";

const STORAGE_KEY = "quick-assessment-schrijven-result";

export default function SchrijvenTrialPage() {
  const router = useRouter();
  const { user, isConfigured } = useAuth();

  const task = useMemo(() => getQuickAssessmentWritingTask(), []);
  const moduleInfo = useMemo(
    () => getQuickAssessmentModules().find((m) => m.module === "schrijven"),
    []
  );

  const [stage, setStage] = useState<Stage>("writing");
  const [submission, setSubmission] = useState("");
  const [startTime] = useState(() => Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Check completed assessment
  useEffect(() => {
    const hasCompletedResult = localStorage.getItem(STORAGE_KEY);
    if (hasCompletedResult) {
      router.push("/learn/schrijven");
    }
  }, [router]);

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
    // Save result to localStorage and go directly to results
    const result = {
      module: "schrijven",
      submission,
      totalTimeMs: Date.now() - startTime,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    setStage("results");
  };

  const isSubmitDisabled = submission.trim().length < 10;
  const isUnlocked = !!user;

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-[var(--ink)]">Opdracht niet gevonden</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      {/* Header */}
      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/try"
                className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <PenLine className="h-5 w-5 text-[var(--accent)]" />
                <h1 className="text-lg font-bold text-[var(--ink)]">
                  {moduleInfo?.name} Trial
                </h1>
              </div>
            </div>
            {stage === "writing" && (
              <div className="flex items-center gap-2 text-[var(--ink)]/60">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Writing Stage */}
          {stage === "writing" && (
            <div className="space-y-6">
              {/* Scenario */}
              <div className="landing-card p-4 bg-[var(--ink)]/5">
                <p className="text-[var(--ink)] mb-2">{task.scenario}</p>
                <p className="text-sm text-[var(--ink)]/60 italic">
                  {task.scenarioEn}
                </p>
              </div>

              {/* Prompt */}
              <div>
                <h2 className="font-bold text-[var(--ink)] mb-2">
                  {task.prompt}
                </h2>
                <p className="text-sm text-[var(--ink)]/60">
                  {task.promptEn}
                </p>
              </div>

              {/* Text input */}
              <div className="space-y-2">
                <textarea
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  placeholder="Schrijf hier je antwoord..."
                  className="w-full min-h-[200px] p-4 rounded-lg border border-[var(--ink)]/20 bg-white text-[var(--ink)] placeholder:text-[var(--ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] resize-y"
                  style={{ fontFamily: "inherit" }}
                />
                {submission.trim().length < 10 && submission.length > 0 && (
                  <p className="text-sm text-[var(--ink)]/60">
                    Write at least a few sentences to submit.
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Submit
              </button>
            </div>
          )}

          {/* Results Stage */}
          {stage === "results" && (
            <div className="space-y-4">
              {/* Side-by-side answer comparison - shown immediately */}
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

              {/* AI Feedback teaser - with correct gradient styling */}
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

              {/* Tips section - compact inline pills */}
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
                /* Logged in: Show next step */
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
                /* Not logged in: Show signup CTAs */
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
                    {isConfigured && (
                      <GoogleSignInButton
                        className="w-full justify-center py-3"
                        redirectTo="/try/schrijven"
                      >
                        Sign up with Google
                      </GoogleSignInButton>
                    )}

                    <Link
                      href="/auth/signup?redirect=/try/schrijven"
                      className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-[var(--ink)] text-white rounded-full font-medium hover:bg-[var(--ink)]/90 transition-colors text-sm"
                    >
                      <Mail className="h-4 w-4" />
                      Sign up with Email
                    </Link>

                    <p className="text-center text-xs text-[var(--ink)]/50">
                      Already have an account?{" "}
                      <Link
                        href="/auth/login?redirect=/try/schrijven"
                        className="text-[var(--accent)] hover:underline"
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
