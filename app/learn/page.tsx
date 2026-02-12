"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Landmark, Headphones, PenLine, Mic, Check } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { getWritingIndex, getSpeakingIndex } from "@/lib/content";

const modules = [
  {
    id: "lezen",
    name: "Lezen",
    description: "Oefen je Nederlandse leesvaardigheid met realistische teksten.",
    descriptionEn: "Practice your Dutch reading skills with realistic texts.",
    icon: BookOpen,
    href: "/learn/lezen/select",
    staticInfo: "4 practice exams",
  },
  {
    id: "knm",
    name: "KNM",
    description: "Test je kennis over Nederlandse cultuur, geschiedenis en waarden.",
    descriptionEn: "Test your knowledge of Dutch culture, history, and values.",
    icon: Landmark,
    href: "/learn/knm/select",
    staticInfo: "4 practice exams",
  },
  {
    id: "luisteren",
    name: "Luisteren",
    description: "Luister naar Nederlandse audiofragmenten en beantwoord vragen.",
    descriptionEn: "Listen to Dutch audio fragments and answer questions.",
    icon: Headphones,
    href: "/learn/luisteren/select",
    staticInfo: "4 practice exams",
  },
  {
    id: "schrijven",
    name: "Schrijven",
    description: "Oefen schrijfopdrachten zoals emails, berichten en formulieren.",
    descriptionEn: "Practice writing tasks like emails, messages, and forms.",
    icon: PenLine,
    href: "/learn/schrijven",
  },
  {
    id: "spreken",
    name: "Spreken",
    description: "Oefen spreekvaardigheden met opnameoefeningen en feedback.",
    descriptionEn: "Practice speaking skills with recording exercises and feedback.",
    icon: Mic,
    href: "/learn/spreken",
  },
];

export default function LearnHubPage() {
  const { progress } = useProgress();
  const writingIndex = getWritingIndex();
  const speakingIndex = getSpeakingIndex();

  const writingTotal = writingIndex.tasks.length;
  const writingCompleted = Object.keys(progress.writingProgress || {}).length;
  const speakingTotal = speakingIndex.tasks.length;
  const speakingCompleted = Object.keys(progress.speakingProgress || {}).length;

  const getProgressInfo = (modId: string) => {
    if (modId === "schrijven") {
      return { completed: writingCompleted, total: writingTotal };
    }
    if (modId === "spreken") {
      return { completed: speakingCompleted, total: speakingTotal };
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
            <h1 className="text-xl font-bold text-[var(--ink)]">
              Oefenexamens
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">
              Kies een Module
            </h2>
            <p className="text-[var(--ink)]/60">
              Selecteer een module om te oefenen voor je inburgeringsexamen.
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
                        <h3 className="font-semibold text-lg text-[var(--ink)]">
                          {mod.name}
                        </h3>
                        <p className="text-sm text-[var(--ink)]/60">
                          {mod.description}
                        </p>
                        <p className="text-xs text-[var(--ink)]/40 mt-0.5">
                          {mod.descriptionEn}
                        </p>
                        <div className="mt-2">
                          {progressInfo ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                              {progressInfo.completed}/{progressInfo.total} completed
                            </span>
                          ) : mod.staticInfo ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--ink)]/5 text-[var(--ink)]/50">
                              {mod.staticInfo}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
