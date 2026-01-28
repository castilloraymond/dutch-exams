"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { getContentIndex, getKNMIndex, getListeningIndex } from "@/lib/content";
import { ArrowLeft, BookOpen, Landmark, Headphones } from "lucide-react";

const modules = [
  {
    id: "lezen",
    name: "Lezen (Reading)",
    description: "Practice Dutch reading comprehension with real-world passages.",
    icon: BookOpen,
    href: "/learn/lezen",
  },
  {
    id: "knm",
    name: "KNM (Dutch Society)",
    description: "Test your knowledge of Dutch culture, history, and values.",
    icon: Landmark,
    href: "/learn/knm",
  },
  {
    id: "luisteren",
    name: "Luisteren (Listening)",
    description: "Listen to Dutch audio fragments and answer questions.",
    icon: Headphones,
    href: "/learn/luisteren",
  },
];

export default function LearnHubPage() {
  const { progress, isLoaded } = useProgress();
  const contentIndex = getContentIndex();
  const knmIndex = getKNMIndex();
  const listeningIndex = getListeningIndex();

  function getModuleStats(id: string) {
    if (!isLoaded) return null;
    if (id === "lezen") {
      const total = contentIndex.passages.length;
      const completed = contentIndex.passages.filter(
        (p) => progress.passageProgress[p.id]?.completed
      ).length;
      return { total, completed };
    }
    if (id === "knm") {
      const total = knmIndex.topics.length;
      const completed = knmIndex.topics.filter(
        (t) => progress.passageProgress[`knm-${t.id}`]?.completed
      ).length;
      return { total, completed };
    }
    if (id === "luisteren") {
      const total = listeningIndex.exercises.length;
      const completed = listeningIndex.exercises.filter(
        (e) => progress.passageProgress[`luisteren-${e.id}`]?.completed
      ).length;
      return { total, completed };
    }
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
      <header className="border-b border-[var(--landing-navy)]/10 sticky top-0 bg-[var(--landing-cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold font-sans-landing text-[var(--landing-navy)]">Practice Modules</h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-serif text-[var(--landing-navy)] mb-2">Choose a Module</h2>
            <p className="text-[var(--landing-navy)]/60">
              Select a module to start practicing for your inburgering exam.
            </p>
          </div>

          <div className="space-y-4">
            {modules.map((mod) => {
              const Icon = mod.icon;
              const stats = getModuleStats(mod.id);
              return (
                <Link key={mod.id} href={mod.href}>
                  <div className="landing-card p-4 sm:p-6 cursor-pointer mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--landing-orange)]/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-[var(--landing-orange)]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-[var(--landing-navy)]">{mod.name}</h3>
                        <p className="text-sm text-[var(--landing-navy)]/60">{mod.description}</p>
                        {stats && (
                          <p className="text-xs text-[var(--landing-navy)]/50 mt-1">
                            {stats.completed}/{stats.total} completed
                          </p>
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
    </main>
  );
}
