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
  Eye,
  EyeOff,
  Mail,
  ArrowRight,
} from "lucide-react";
import { getQuickAssessmentWritingTask, getQuickAssessmentModules } from "@/lib/content";
import type { FormAnswer, AssessmentCriterion } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

type Stage = "writing" | "self-assessment" | "results";

const STORAGE_KEY = "quick-assessment-schrijven-result";

export default function SchrijvenTrialPage() {
  const router = useRouter();
  const { user, loading: authLoading, isConfigured } = useAuth();

  const task = useMemo(() => getQuickAssessmentWritingTask(), []);
  const moduleInfo = useMemo(
    () => getQuickAssessmentModules().find((m) => m.module === "schrijven"),
    []
  );

  const [stage, setStage] = useState<Stage>("writing");
  const [submission, setSubmission] = useState("");
  const [startTime] = useState(() => Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [checkedCriteria, setCheckedCriteria] = useState<Set<string>>(new Set());
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Check if user already completed this assessment
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      const hasCompletedResult = localStorage.getItem(STORAGE_KEY);
      if (hasCompletedResult) {
        router.push("/learn/schrijven");
        return;
      }
    }
  }, [user, authLoading, router]);

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

  const toggleCriterion = (id: string) => {
    const newChecked = new Set(checkedCriteria);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedCriteria(newChecked);
  };

  const handleSelfAssessmentComplete = () => {
    // Save result to localStorage
    const result = {
      module: "schrijven",
      submission,
      checkedCriteria: Array.from(checkedCriteria),
      totalTimeMs: Date.now() - startTime,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    setStage("results");
  };

  const isSubmitDisabled = submission.trim().length < 10;
  const allChecked = task ? checkedCriteria.size === task.selfAssessmentCriteria.length : false;
  const score = checkedCriteria.size;
  const total = task?.selfAssessmentCriteria.length || 0;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= 60;
  const isUnlocked = !!user;

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
                href="/try"
                className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <PenLine className="h-5 w-5 text-[var(--landing-orange)]" />
                <h1 className="text-lg font-bold font-sans-landing text-[var(--landing-navy)]">
                  {moduleInfo?.name} Trial
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
          {/* Writing Stage */}
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

              {/* Text input */}
              <div className="space-y-2">
                <textarea
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  placeholder="Schrijf hier je antwoord..."
                  className="w-full min-h-[200px] p-4 rounded-lg border border-[var(--landing-navy)]/20 bg-white text-[var(--landing-navy)] placeholder:text-[var(--landing-navy)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--landing-orange)]/50 focus:border-[var(--landing-orange)] resize-y"
                  style={{ fontFamily: "inherit" }}
                />
                {submission.trim().length < 10 && submission.length > 0 && (
                  <p className="text-sm text-[var(--landing-navy)]/60">
                    Write at least a few sentences to submit.
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className="w-full bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Submit
              </button>
            </div>
          )}

          {/* Self-Assessment Stage */}
          {stage === "self-assessment" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--landing-navy)] mb-2">
                  Rate Your Own Work
                </h2>
                <p className="text-[var(--landing-navy)]/60">
                  Read your answer and check off what you did.
                </p>
              </div>

              {/* Submission display */}
              <div className="landing-card p-4 bg-[var(--landing-navy)]/5">
                <h3 className="text-sm font-medium text-[var(--landing-navy)]/60 mb-2">
                  Your answer:
                </h3>
                <p className="text-[var(--landing-navy)] whitespace-pre-wrap">
                  {submission}
                </p>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[var(--landing-navy)]">Checklist</h3>
                  <span className="text-sm text-[var(--landing-navy)]/60">
                    {checkedCriteria.size}/{task.selfAssessmentCriteria.length} checked
                  </span>
                </div>

                {task.selfAssessmentCriteria.map((criterion: AssessmentCriterion) => (
                  <button
                    key={criterion.id}
                    onClick={() => toggleCriterion(criterion.id)}
                    className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-colors text-left ${
                      checkedCriteria.has(criterion.id)
                        ? "border-green-500 bg-green-50"
                        : "border-[var(--landing-navy)]/20 bg-white hover:bg-[var(--landing-navy)]/5"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                        checkedCriteria.has(criterion.id)
                          ? "border-green-500 bg-green-500"
                          : "border-[var(--landing-navy)]/30"
                      }`}
                    >
                      {checkedCriteria.has(criterion.id) && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="text-[var(--landing-navy)]">{criterion.textEn}</span>
                  </button>
                ))}
              </div>

              {/* Continue button */}
              <button
                onClick={handleSelfAssessmentComplete}
                disabled={!allChecked}
                className="w-full bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {allChecked
                  ? "See Results"
                  : `Check all ${task.selfAssessmentCriteria.length} items to continue`}
              </button>
            </div>
          )}

          {/* Results Stage */}
          {stage === "results" && (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="landing-card p-6 text-center">
                <h2 className="text-sm font-medium text-[var(--landing-navy)]/50 uppercase tracking-wide mb-4">
                  Your Self-Assessment
                </h2>

                <div className="flex justify-center items-center gap-4 mb-4">
                  <div
                    className={`text-5xl font-bold ${
                      passed ? "text-green-500" : "text-[var(--landing-orange)]"
                    }`}
                  >
                    {score}/{total}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      passed
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {percentage}%
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[var(--landing-navy)]/60">
                  <Clock className="h-4 w-4" />
                  <span>Completed in {formatTime(elapsedTime)}</span>
                </div>
              </div>

              {/* Conversion hook - AI Feedback teaser */}
              <div className="landing-card p-6 bg-gradient-to-r from-[var(--landing-navy)] to-[var(--landing-navy)]/90 text-white">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Want AI feedback on your writing?
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      You rated yourself {score}/{total}. But how was your grammar really?
                      Pro members get their writing analyzed for spelling, grammar, and word choice.
                    </p>
                    <Link
                      href="/auth/signup?redirect=/try/schrijven"
                      className="inline-block bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                      Sign up to unlock
                    </Link>
                  </div>
                </div>
              </div>

              {/* Model answer section */}
              <div className="landing-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[var(--landing-navy)]">
                    Example Answer
                  </h3>
                  <button
                    onClick={() => setShowModelAnswer(!showModelAnswer)}
                    className="flex items-center gap-2 text-[var(--landing-orange)] hover:text-[var(--landing-orange)]/80 transition-colors"
                  >
                    {showModelAnswer ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {showModelAnswer ? "Hide" : "Show answer"}
                    </span>
                  </button>
                </div>

                {showModelAnswer ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* User's answer */}
                    <div className="p-4 rounded-lg bg-[var(--landing-navy)]/5">
                      <h4 className="text-sm font-medium text-[var(--landing-navy)]/60 mb-2">
                        Your answer:
                      </h4>
                      <p className="text-[var(--landing-navy)] whitespace-pre-wrap text-sm">
                        {submission}
                      </p>
                    </div>

                    {/* Model answer */}
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <h4 className="text-sm font-medium text-green-700 mb-2">
                        Example answer:
                      </h4>
                      <p className="text-[var(--landing-navy)] whitespace-pre-wrap text-sm">
                        {task.modelAnswer as string}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[var(--landing-navy)]/60 text-sm">
                    Click &quot;Show answer&quot; to see the example answer and compare your work.
                  </p>
                )}
              </div>

              {/* Tips section */}
              <div className="landing-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-[var(--landing-orange)]" />
                  <h3 className="font-bold text-[var(--landing-navy)]">Tips</h3>
                </div>
                <ul className="space-y-2">
                  {task.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-[var(--landing-navy)]"
                    >
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Section */}
              {isUnlocked ? (
                /* Logged in: Show next step */
                <div className="landing-card p-6 bg-gradient-to-r from-[var(--landing-orange)]/5 to-[var(--landing-orange)]/10">
                  <h3 className="font-semibold text-[var(--landing-navy)] mb-2">
                    Ready to practice more?
                  </h3>
                  <p className="text-sm text-[var(--landing-navy)]/60 mb-4">
                    Try more writing tasks to prepare for the real exam.
                  </p>
                  <Link
                    href="/learn/schrijven"
                    className="inline-flex items-center gap-2 cta-primary px-6 py-3 text-white rounded-lg font-semibold"
                  >
                    Practice More Writing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                /* Not logged in: Show signup CTAs */
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-[var(--landing-navy)] mb-1">
                      Save your progress & get AI feedback
                    </h3>
                    <p className="text-sm text-[var(--landing-navy)]/60">
                      Create a free account to continue learning
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {isConfigured && (
                      <GoogleSignInButton
                        className="w-full justify-center py-3.5"
                        redirectTo="/try/schrijven"
                      >
                        Sign up with Google
                      </GoogleSignInButton>
                    )}

                    <Link
                      href="/auth/signup?redirect=/try/schrijven"
                      className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[var(--landing-navy)] text-white rounded-full font-medium hover:bg-[var(--landing-navy)]/90 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Sign up with Email
                    </Link>

                    <p className="text-center text-sm text-[var(--landing-navy)]/50">
                      Already have an account?{" "}
                      <Link
                        href="/auth/login?redirect=/try/schrijven"
                        className="text-[var(--landing-orange)] hover:underline"
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
