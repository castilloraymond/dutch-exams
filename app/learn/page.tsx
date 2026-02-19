"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Landmark, Headphones, PenLine, Mic, Check, X, Sparkles, ArrowRight, PartyPopper, Infinity, Rocket, ShieldCheck, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { getMockExamIndex } from "@/lib/content";

const modules = [
  {
    id: "lezen",
    name: "Lezen",
    description: "Oefen je Nederlandse leesvaardigheid met realistische teksten.",
    descriptionEn: "Practice your Dutch reading skills with realistic texts.",
    icon: BookOpen,
    href: "/learn/lezen/select",
  },
  {
    id: "knm",
    name: "KNM",
    description: "Test je kennis over Nederlandse cultuur, geschiedenis en waarden.",
    descriptionEn: "Test your knowledge of Dutch culture, history, and values.",
    icon: Landmark,
    href: "/learn/knm/select",
  },
  {
    id: "luisteren",
    name: "Luisteren",
    description: "Luister naar Nederlandse audiofragmenten en beantwoord vragen.",
    descriptionEn: "Listen to Dutch audio fragments and answer questions.",
    icon: Headphones,
    href: "/learn/luisteren/select",
  },
  {
    id: "schrijven",
    name: "Schrijven",
    description: "Oefen schrijfopdrachten zoals emails, berichten en formulieren.",
    descriptionEn: "Practice writing tasks like emails, messages, and forms.",
    icon: PenLine,
    href: "/learn/schrijven/select",
  },
  {
    id: "spreken",
    name: "Spreken",
    description: "Oefen spreekvaardigheden met opnameoefeningen en feedback.",
    descriptionEn: "Practice speaking skills with recording exercises and feedback.",
    icon: Mic,
    href: "/learn/spreken/select",
  },
];

export default function LearnHubPage() {
  const { refreshSession } = useAuth();
  const { progress } = useProgress();

  const searchParams = useSearchParams();

  // Onboarding state
  const [showWelcome, setShowWelcome] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);

  // Upgrade banner
  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      refreshSession();
      setShowUpgradeBanner(true);
      window.history.replaceState({}, "", "/learn");
    }
  }, [searchParams, refreshSession]);

  useEffect(() => {
    // Welcome banner: show if no progress and banner not yet dismissed
    const dismissed = localStorage.getItem("onboarding-welcome-dismissed");
    const hasAnyProgress =
      Object.keys(progress.examProgress || {}).length > 0 ||
      Object.keys(progress.writingProgress || {}).length > 0 ||
      Object.keys(progress.speakingProgress || {}).length > 0;
    if (!dismissed && !hasAnyProgress) setShowWelcome(true);

    // First-login toast
    const hasLoggedIn = localStorage.getItem("has-logged-in-before");
    if (!hasLoggedIn) {
      setShowToast(true);
      localStorage.setItem("has-logged-in-before", "1");
      setTimeout(() => setShowToast(false), 5000);
    }
  }, [progress]);

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("onboarding-welcome-dismissed", "1");
  };

  const hasZeroProgress =
    Object.keys(progress.examProgress || {}).length === 0 &&
    Object.keys(progress.writingProgress || {}).length === 0 &&
    Object.keys(progress.speakingProgress || {}).length === 0;

  // Count exam completions for lezen/knm/luisteren (free exam + mock exams)
  const examProgress = progress.examProgress || {};

  const getExamModuleProgress = (modId: string) => {
    const mockIndex = getMockExamIndex(modId);
    const mockExamIds = mockIndex?.exams.map((e) => e.id) || [];
    const freeExamId = `${modId}-free-exam`;
    const allExamIds = [freeExamId, ...mockExamIds];
    const completed = allExamIds.filter((id) => id in examProgress).length;
    return { completed, total: allExamIds.length };
  };

  const getProgressInfo = (modId: string) => {
    if (modId === "schrijven") {
      const mockIndex = getMockExamIndex("schrijven");
      const mockExamIds = mockIndex?.exams.map((e) => e.id) || [];
      const completed = mockExamIds.filter((id) => id in (progress.writingProgress || {})).length;
      return { completed, total: mockExamIds.length };
    }
    if (modId === "spreken") {
      const mockIndex = getMockExamIndex("spreken");
      const mockExamIds = mockIndex?.exams.map((e) => e.id) || [];
      const completed = mockExamIds.filter((id) => id in (progress.speakingProgress || {})).length;
      return { completed, total: mockExamIds.length };
    }
    if (modId === "lezen" || modId === "knm" || modId === "luisteren") {
      return getExamModuleProgress(modId);
    }
    return null;
  };

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
            <div>
              <h1 className="text-xl font-bold text-[var(--ink)]">
                Oefenexamens
              </h1>
              <p className="text-xs text-[var(--ink)]/40">Practice Exams</p>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Welcome banner for first-time users */}
          {showWelcome && (
            <div className="relative bg-gradient-to-r from-[var(--accent-soft)] to-white rounded-xl p-5 border border-[var(--accent)]/20">
              <button
                onClick={dismissWelcome}
                className="absolute top-3 right-3 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[var(--ink)] mb-1">Welcome! Here&apos;s how to get started</h3>
                  <p className="text-sm text-[var(--ink-soft)]">
                    Practice all 5 modules of the Dutch inburgering exam with 900+ questions. Take a quick assessment to see where you stand, or jump straight into KNM — the module most expats start with.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 ml-8">
                <Link
                  href="/try"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-glow)] transition-colors"
                >
                  Take Quick Assessment
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/learn/knm/select"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                >
                  Start with KNM
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-1">
              Kies een Module
            </h2>
            <p className="text-sm text-[var(--ink)]/40 mb-2">Choose a Module</p>
            <p className="text-[var(--ink)]/60">
              Selecteer een module om te oefenen voor je inburgeringsexamen.
            </p>
            <p className="text-sm text-[var(--ink)]/40">
              Select a module to practice for your civic integration exam.
            </p>
          </div>

          <div className="space-y-4">
            {modules.map((mod) => {
              const Icon = mod.icon;
              const progressInfo = getProgressInfo(mod.id);
              const isAllDone = progressInfo
                ? progressInfo.completed >= progressInfo.total
                : false;

              return (
                <Link key={mod.id} href={mod.href}>
                  <div className="landing-card p-4 sm:p-6 cursor-pointer mb-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-[var(--accent)]" />
                        {isAllDone && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--green)] rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-[var(--ink)]">
                            {mod.name}
                          </h3>
                          {hasZeroProgress && (mod.id === "knm" || mod.id === "lezen") && (
                            <span className="text-[0.68rem] font-semibold text-[var(--green)] bg-[var(--green-soft)] px-2 py-0.5 rounded-full">
                              Good starting point
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--ink)]/60">
                          {mod.description}
                        </p>
                        <p className="text-xs text-[var(--ink)]/40 mt-0.5">
                          {mod.descriptionEn}
                        </p>
                        {progressInfo && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-[var(--ink)]/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
                                  style={{
                                    width: `${progressInfo.total > 0 ? (progressInfo.completed / progressInfo.total) * 100 : 0}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-[var(--ink)]/50 whitespace-nowrap">
                                {progressInfo.completed}/{progressInfo.total}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <LandingFooter />

      {/* First-login toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--ink)] text-white text-sm px-5 py-3 rounded-full shadow-lg z-50 animate-reveal">
          Account created! Your progress is saved automatically.
        </div>
      )}

      {/* Upgrade congratulations banner */}
      {showUpgradeBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-reveal">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
            <button
              onClick={() => setShowUpgradeBanner(false)}
              className="absolute top-4 right-4 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="h-8 w-8 text-[var(--accent)]" />
            </div>

            <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">
              Welcome, Founding Member!
            </h2>
            <p className="text-[var(--ink-soft)] mb-6">
              Thank you for joining us early. Your support makes this project possible. Here&apos;s what you&apos;ve unlocked:
            </p>

            <div className="text-left space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <Infinity className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--ink)]"><span className="font-semibold">Lifetime access</span> — all 28 mock exams, writing & speaking exercises, forever</p>
              </div>
              <div className="flex items-start gap-3">
                <Rocket className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--ink)]"><span className="font-semibold">Future updates included</span> — new content, features, and improvements at no extra cost</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--ink)]"><span className="font-semibold">Full refund guarantee</span> — no questions asked, anytime</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--ink)]"><span className="font-semibold">Direct access to the team</span> — email us anytime with questions, feedback, or bug reports</p>
              </div>
            </div>

            <button
              onClick={() => setShowUpgradeBanner(false)}
              className="cta-primary w-full py-3 rounded-xl font-semibold text-white"
            >
              Start Practicing
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
