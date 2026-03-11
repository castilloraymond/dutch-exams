"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Landmark, Headphones, PenLine, Mic } from "lucide-react";
import { useUser } from "@clerk/nextjs";
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
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [freeExamCompleted, setFreeExamCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      router.replace("/learn");
      return;
    }
    setFreeExamCompleted(!!localStorage.getItem("free-exam-completed"));
    setIsLoading(false);
  }, [isLoaded, user, router]);

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

      <section className="flex-1 container mx-auto px-4 py-5 sm:py-8">
        <div className="max-w-lg mx-auto">
          {freeExamCompleted ? (
            /* Signup prompt after completing free exam */
            <div className="space-y-5">
              <div className="text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] mb-2">
                  Great job on your first exam!
                </h2>
                <p className="text-[var(--ink)]/60 text-sm sm:text-base">
                  Sign up for free to unlock all mock exams across all 5 modules.
                </p>
              </div>

              <div className="landing-card p-5 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent)]/10 border-2 border-[var(--accent)]/20">
                <div className="space-y-4 text-center">
                  <div className="space-y-1.5">
                    <p className="font-semibold text-sm text-[var(--ink)]">What you get with a free account:</p>
                    <ul className="text-xs sm:text-sm text-[var(--ink)]/70 space-y-0.5">
                      <li>46+ mock exams across all 5 exam modules</li>
                      <li>Track your progress and scores</li>
                      <li>Detailed explanations for every question</li>
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                    <Link
                      href="/auth/signup"
                      className="cta-primary py-2.5 px-8 inline-flex items-center justify-center gap-2"
                    >
                      Sign up free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/auth/login"
                      className="py-2 px-6 text-sm font-medium text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors inline-flex items-center justify-center"
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
              <div className="text-center mb-5 sm:mb-8">
                <p className="text-[var(--ink)]/50 text-sm">
                  No signup required — pick a module to start.
                </p>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {moduleCards.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <Link key={mod.key} href={mod.href}>
                      <div className="landing-card px-4 py-3.5 sm:p-5 cursor-pointer hover:shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-[var(--accent)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-1.5">
                              <h3 className="font-semibold text-[var(--ink)]">
                                {mod.name}
                              </h3>
                              <span className="text-xs text-[var(--ink)]/40">
                                {mod.nameEnglish}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[var(--ink)]/45 mt-0.5">
                              <span>{mod.recommendedTime}</span>
                              <span className="text-[var(--ink)]/20">·</span>
                              <span>{mod.label}</span>
                              <span className="text-[var(--ink)]/20">·</span>
                              <span className="text-[var(--accent)] font-medium">{mod.difficulty}</span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[var(--ink)]/25 flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <p className="text-center text-xs text-[var(--ink)]/40 mt-5">
                Same format and difficulty as the real Inburgering exam.
              </p>
            </>
          )}
        </div>
      </section>
      <LandingFooter />
    </main>
  );
}
