"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Landmark, Headphones, PenLine, Mic, Clock, Lock } from "lucide-react";
import { getMockExamIndex, getFreePreviewExamId } from "@/lib/content";
import { LandingFooter } from "@/components/landing/LandingFooter";

const modules = [
  { key: "lezen", name: "Lezen", nameEnglish: "Reading", icon: BookOpen, taskType: "mcq" as const },
  { key: "knm", name: "KNM", nameEnglish: "Dutch Society", icon: Landmark, taskType: "mcq" as const },
  { key: "luisteren", name: "Luisteren", nameEnglish: "Listening", icon: Headphones, taskType: "mcq" as const },
  { key: "schrijven", name: "Schrijven", nameEnglish: "Writing", icon: PenLine, taskType: "task" as const },
  { key: "spreken", name: "Spreken", nameEnglish: "Speaking", icon: Mic, taskType: "task" as const },
];

export default function TryPage() {
  const [freeExamCompleted, setFreeExamCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setFreeExamCompleted(!!localStorage.getItem("free-exam-completed"));
    setIsLoading(false);
  }, []);

  // Build module cards with real exam data
  const moduleCards = modules.map((mod) => {
    const index = getMockExamIndex(mod.key);
    const freeExamId = getFreePreviewExamId(mod.key);
    const freeExam = index?.exams.find((e) => e.id === freeExamId);

    const href = `/try/${mod.key}`;
    const label = mod.taskType === "task" ? "1 task" : `${freeExam?.questionCount ?? 0} questions`;

    return {
      ...mod,
      href,
      label,
      questionCount: freeExam?.questionCount ?? 0,
      recommendedTime: freeExam?.recommendedTime ?? "",
      difficulty: freeExam?.difficulty ?? "A2",
    };
  });

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-[var(--ink)]/60">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-[var(--ink)]">
              Free Mock Exam
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {freeExamCompleted ? (
            /* Signup prompt after completing free exam */
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-[var(--ink)] mb-3">
                  Great job on your first exam!
                </h2>
                <p className="text-[var(--ink)]/60 text-lg">
                  Sign up for free to unlock all mock exams across all 5 modules.
                </p>
              </div>

              <div className="landing-card p-6 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent)]/10 border-2 border-[var(--accent)]/20">
                <div className="space-y-4 text-center">
                  <div className="space-y-2">
                    <p className="font-semibold text-[var(--ink)]">What you get with a free account:</p>
                    <ul className="text-sm text-[var(--ink)]/70 space-y-1">
                      <li>46+ mock exams across all 5 exam modules</li>
                      <li>Track your progress and scores</li>
                      <li>Detailed explanations for every question</li>
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/auth/signup"
                      className="cta-primary py-3 px-8 inline-flex items-center justify-center gap-2"
                    >
                      Sign up free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/auth/login"
                      className="py-3 px-6 text-sm font-medium text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors inline-flex items-center justify-center"
                    >
                      Already have an account? Log in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Module selection for new users */
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-[var(--ink)] mb-3">
                  Try a Free Mock Exam
                </h2>
                <p className="text-[var(--ink)]/60 text-lg">
                  Take a full mock exam — no signup required. Pick a module to start.
                </p>
              </div>

              <div className="space-y-4">
                {moduleCards.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <Link key={mod.key} href={mod.href}>
                      <div className="landing-card p-5 sm:p-6 cursor-pointer mb-4 hover:shadow-lg transition-all hover:scale-[1.01]">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                            <Icon className="h-7 w-7 text-[var(--accent)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg text-[var(--ink)]">
                                {mod.name}
                              </h3>
                              <span className="text-sm text-[var(--ink)]/50">
                                ({mod.nameEnglish})
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-[var(--ink)]/50 mt-2">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {mod.recommendedTime}
                              </span>
                              <span>{mod.label}</span>
                              <span className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full font-medium">
                                {mod.difficulty} Level
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-[var(--ink)]/30 flex-shrink-0 mt-4" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="text-center text-sm text-[var(--ink)]/50">
                <p>
                  These exams use the same format and difficulty as the real Inburgering exam.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
      <LandingFooter />
    </main>
  );
}
