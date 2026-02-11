"use client";

import Link from "next/link";
import { ArrowLeft, PenLine, FileText, ClipboardList, Check } from "lucide-react";
import { getWritingIndex } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";
import { MockupNote } from "@/components/MockupNote";

export default function SchrijvenPage() {
  const index = getWritingIndex();
  const { progress } = useProgress();

  const a1Tasks = index.tasks.filter((t) => t.difficulty === "A1");
  const a2Tasks = index.tasks.filter((t) => t.difficulty === "A2");

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case "form":
        return ClipboardList;
      default:
        return FileText;
    }
  };

  const getTaskTypeBadge = (taskType: string) => {
    switch (taskType) {
      case "form":
        return "Formulier";
      default:
        return "Bericht";
    }
  };

  const renderTaskCard = (task: (typeof index.tasks)[number]) => {
    const Icon = getTaskIcon(task.taskType);
    const isCompleted = progress.writingProgress?.[task.id]?.completedAt;

    return (
      <Link key={task.id} href={`/learn/schrijven/${task.id}`}>
        <div className="landing-card p-4 sm:p-6 cursor-pointer mb-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center relative">
              <Icon className="h-6 w-6 text-[var(--accent)]" />
              {isCompleted && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-[var(--ink)]">
                  {task.title}
                </h3>
              </div>
              <p className="text-sm text-[var(--ink)]/60">
                {task.titleEn}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent)]">
                  {getTaskTypeBadge(task.taskType)}
                </span>
                {task.isFreePreview && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    Gratis
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/learn"
              className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <PenLine className="h-5 w-5 text-[var(--accent)]" />
              <h1 className="text-xl font-bold text-[var(--ink)]">
                Schrijven
              </h1>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">
              Schrijfoefeningen
            </h2>
            <p className="text-[var(--ink)]/60">
              Oefen met realistische schrijfopdrachten zoals je die op het examen tegenkomt.
            </p>
          </div>

          <MockupNote />

          {/* Info banner */}
          <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg p-4">
            <p className="text-sm text-[var(--ink)]">
              <span className="font-semibold">Tip:</span> On the real exam you write by hand.
              Practice your Dutch handwriting too!
            </p>
          </div>

          <div className="space-y-8">
            {/* A1 Section */}
            {a1Tasks.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--green)]/10 text-[var(--green)]">
                    A1
                  </span>
                  <div>
                    <h3 className="font-semibold text-[var(--ink)]">
                      A1 - Beginner
                    </h3>
                    <p className="text-sm text-[var(--ink)]/60">
                      Eenvoudige schrijfopdrachten
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {a1Tasks.map(renderTaskCard)}
                </div>
              </div>
            )}

            {/* A2 Section */}
            {a2Tasks.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                    A2
                  </span>
                  <div>
                    <h3 className="font-semibold text-[var(--ink)]">
                      A2 - Intermediate
                    </h3>
                    <p className="text-sm text-[var(--ink)]/60">
                      Standaard examenniveau
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {a2Tasks.map(renderTaskCard)}
                </div>
              </div>
            )}
          </div>

          {/* Pro upsell */}
          <div className="rounded-xl shadow-lg p-6 bg-gradient-to-r from-[var(--ink)] to-[var(--ink)]/90 text-white">
            <h3 className="font-bold text-lg mb-2">
              Wil je AI-feedback op je schrijfwerk?
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Pro-leden krijgen directe feedback op grammatica, woordenschat en schrijfstijl.
            </p>
            <Link href="/upgrade" className="inline-block bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Upgrade naar Pro
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
