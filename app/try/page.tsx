"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Landmark, Headphones, PenLine, Mic, Clock } from "lucide-react";
import { getQuickAssessmentModules, getQuickAssessmentQuestions } from "@/lib/content";
import { LandingFooter } from "@/components/landing/LandingFooter";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Landmark,
  Headphones,
  PenLine,
  Mic,
};

export default function TryPage() {
  const modules = getQuickAssessmentModules();

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
              Quick Assessment
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-3">
              See How Ready You Are
            </h2>
            <p className="text-[var(--ink)]/60 text-lg">
              Take a quick sample assessment. No signup required.
            </p>
          </div>

          <div className="space-y-4">
            {modules.map((mod) => {
              const Icon = iconMap[mod.icon] || BookOpen;
              return (
                <Link key={mod.module} href={`/try/${mod.module}`}>
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
                        <p className="text-sm text-[var(--ink)]/60 mb-3">
                          {mod.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[var(--ink)]/50">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            ~{mod.estimatedMinutes} min
                          </span>
                          <span>{mod.taskType === "task" ? "1 task" : `${getQuickAssessmentQuestions(mod.module).length} questions`}</span>
                          <span className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full font-medium">
                            A2 Level
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center text-sm text-[var(--ink)]/50">
            <p>
              This quick assessment reflects the actual A2 difficulty level of the Inburgering exam.
            </p>
          </div>
        </div>
      </section>
      <LandingFooter />
    </main>
  );
}
