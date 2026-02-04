"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  Mail,
} from "lucide-react";
import {
  getQuickAssessmentQuestions,
  getQuickAssessmentModules,
  type QuickAssessmentQuestion,
} from "@/lib/content";
import type { QuickAssessmentModule, QuickAssessmentAttempt } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

const STORAGE_KEY_PREFIX = "quick-assessment-";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const module = params.module as QuickAssessmentModule;
  const { user, loading: authLoading, isConfigured } = useAuth();

  const [result, setResult] = useState<QuickAssessmentAttempt | null>(null);
  const [questions, setQuestions] = useState<QuickAssessmentQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const modules = getQuickAssessmentModules();
    const validModule = modules.find((m) => m.module === module);

    if (!validModule) {
      router.push("/try");
      return;
    }

    // Load result from localStorage
    const resultKey = `${STORAGE_KEY_PREFIX}${module}-result`;
    const saved = localStorage.getItem(resultKey);

    if (!saved) {
      // No result found, redirect to quiz
      router.push(`/try/${module}`);
      return;
    }

    try {
      const parsedResult: QuickAssessmentAttempt = JSON.parse(saved);
      setResult(parsedResult);

      const loadedQuestions = getQuickAssessmentQuestions(module);
      setQuestions(loadedQuestions);
    } catch {
      router.push(`/try/${module}`);
      return;
    }

    setIsLoading(false);
  }, [module, router]);

  if (isLoading || authLoading || !result) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--landing-cream)]">
        <div className="text-[var(--landing-navy)]/60">Loading results...</div>
      </main>
    );
  }

  const moduleInfo = getQuickAssessmentModules().find((m) => m.module === module);
  const score = result.score;
  const total = result.answers.length;
  const percentage = Math.round((score / total) * 100);
  const isUnlocked = !!user;

  // Build question map for breakdown
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
      {/* Header */}
      <header className="border-b border-[var(--landing-navy)]/10 sticky top-0 bg-[var(--landing-cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/try"
              className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold font-sans-landing text-[var(--landing-navy)]">
              {moduleInfo?.name} Results
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Score Card */}
          <div className="landing-card p-6 text-center">
            <h2 className="text-sm font-medium text-[var(--landing-navy)]/50 uppercase tracking-wide mb-4">
              Your Readiness Score
            </h2>

            <div className="relative inline-flex items-center justify-center mb-4">
              {/* Progress ring */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-[var(--landing-navy)]/10"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(percentage / 100) * 352} 352`}
                  className={percentage >= 60 ? "text-[var(--landing-green)]" : "text-[var(--landing-orange)]"}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[var(--landing-navy)]">
                  {score}/{total}
                </span>
                <span className="text-lg text-[var(--landing-navy)]/60">{percentage}%</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[var(--landing-navy)]/60 mb-6">
              <Clock className="h-4 w-4" />
              <span>Completed in {formatTime(result.totalTimeMs)}</span>
            </div>

            {/* Comparison framing */}
            <div className="bg-[var(--landing-navy)]/5 rounded-lg p-4 text-sm text-[var(--landing-navy)]/70">
              <p>
                The passing threshold is <strong className="text-[var(--landing-navy)]">60%</strong>, but
                successful test-takers score{" "}
                <strong className="text-[var(--landing-navy)]">80%+</strong> in practice.
              </p>
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="landing-card overflow-hidden">
            <div className="p-4 border-b border-[var(--landing-navy)]/10">
              <h3 className="font-semibold text-[var(--landing-navy)]">Question Breakdown</h3>
            </div>

            {isUnlocked ? (
              /* Unlocked breakdown */
              <div className="divide-y divide-[var(--landing-navy)]/5">
                {result.answers.map((answer, index) => {
                  const question = questionMap.get(answer.questionId);
                  if (!question) return null;

                  return (
                    <div key={answer.questionId} className="p-4">
                      <div className="flex items-start gap-3">
                        {answer.correct ? (
                          <CheckCircle2 className="h-5 w-5 text-[var(--landing-green)] flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--landing-navy)] mb-2">
                            <span className="font-medium">Q{index + 1}:</span> {question.text}
                          </p>
                          {!answer.correct && (
                            <div className="text-xs space-y-1 mb-2">
                              <p className="text-red-600">
                                Your answer: {question.options[answer.selectedIndex]}
                              </p>
                              <p className="text-[var(--landing-green)]">
                                Correct: {question.options[question.correctIndex]}
                              </p>
                            </div>
                          )}
                          {question.explanation && (
                            <p className="text-xs text-[var(--landing-navy)]/60 bg-[var(--landing-navy)]/5 p-2 rounded">
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Locked breakdown */
              <div className="relative">
                <div className="p-4 space-y-3 blur-sm select-none pointer-events-none">
                  {result.answers.slice(0, 4).map((answer, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {answer.correct ? (
                        <CheckCircle2 className="h-5 w-5 text-[var(--landing-green)] flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="h-4 bg-[var(--landing-navy)]/10 rounded w-full mb-2" />
                        <div className="h-3 bg-[var(--landing-navy)]/5 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lock overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <div className="text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-[var(--landing-orange)]/10 flex items-center justify-center mx-auto mb-3">
                      <Lock className="h-6 w-6 text-[var(--landing-orange)]" />
                    </div>
                    <p className="text-sm text-[var(--landing-navy)]/70 mb-1">
                      Sign up to see which questions you missed
                    </p>
                    <p className="text-xs text-[var(--landing-navy)]/50">
                      and learn why with detailed explanations
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          {isUnlocked ? (
            /* Logged in: Show next step */
            <div className="landing-card p-6 bg-gradient-to-r from-[var(--landing-orange)]/5 to-[var(--landing-orange)]/10">
              <h3 className="font-semibold text-[var(--landing-navy)] mb-2">
                Ready to improve your score?
              </h3>
              <p className="text-sm text-[var(--landing-navy)]/60 mb-4">
                Take a full practice exam to prepare for the real test.
              </p>
              <Link
                href={`/learn/${module}/mock`}
                className="inline-flex items-center gap-2 cta-primary px-6 py-3 text-white rounded-lg font-semibold"
              >
                Start Full {moduleInfo?.name} Practice Exam
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            /* Not logged in: Show signup CTAs */
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-[var(--landing-navy)] mb-1">
                  Save your results & see what you missed
                </h3>
                <p className="text-sm text-[var(--landing-navy)]/60">
                  Create a free account to unlock the full breakdown
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {isConfigured && (
                  <GoogleSignInButton
                    className="w-full justify-center py-3.5"
                    redirectTo={`/try/${module}/results`}
                  >
                    Sign up with Google
                  </GoogleSignInButton>
                )}

                <Link
                  href={`/auth/signup?redirect=/try/${module}/results`}
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[var(--landing-navy)] text-white rounded-full font-medium hover:bg-[var(--landing-navy)]/90 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Sign up with Email
                </Link>

                <p className="text-center text-sm text-[var(--landing-navy)]/50">
                  Already have an account?{" "}
                  <Link
                    href={`/auth/login?redirect=/try/${module}/results`}
                    className="text-[var(--landing-orange)] hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
