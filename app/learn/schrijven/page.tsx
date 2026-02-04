"use client";

import Link from "next/link";
import { ArrowLeft, PenLine, FileText, ClipboardList, Check } from "lucide-react";
import { getWritingIndex } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";

export default function SchrijvenPage() {
  const index = getWritingIndex();
  const { progress } = useProgress();

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

  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
      <header className="border-b border-[var(--landing-navy)]/10 sticky top-0 bg-[var(--landing-cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/learn"
              className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <PenLine className="h-5 w-5 text-[var(--landing-orange)]" />
              <h1 className="text-xl font-bold font-sans-landing text-[var(--landing-navy)]">
                Schrijven
              </h1>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-serif text-[var(--landing-navy)] mb-2">
              Schrijfoefeningen
            </h2>
            <p className="text-[var(--landing-navy)]/60">
              Oefen met realistische schrijfopdrachten zoals je die op het examen tegenkomt.
            </p>
          </div>

          {/* Info banner */}
          <div className="bg-[var(--landing-orange)]/10 border border-[var(--landing-orange)]/30 rounded-lg p-4">
            <p className="text-sm text-[var(--landing-navy)]">
              <span className="font-semibold">Tip:</span> Op het echte examen schrijf je met de hand.
              Oefen ook je Nederlandse handschrift!
            </p>
          </div>

          <div className="space-y-4">
            {index.tasks.map((task) => {
              const Icon = getTaskIcon(task.taskType);
              const isCompleted = progress.writingProgress?.[task.id]?.completedAt;

              return (
                <Link key={task.id} href={`/learn/schrijven/${task.id}`}>
                  <div className="landing-card p-4 sm:p-6 cursor-pointer mb-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--landing-orange)]/10 flex items-center justify-center relative">
                        <Icon className="h-6 w-6 text-[var(--landing-orange)]" />
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-[var(--landing-navy)]">
                            {task.title}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--landing-navy)]/10 text-[var(--landing-navy)]/70">
                            {task.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--landing-navy)]/60">
                          {task.titleEn}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--landing-orange)]/20 text-[var(--landing-orange)]">
                            {getTaskTypeBadge(task.taskType)}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            Gratis
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pro upsell */}
          <div className="landing-card p-6 bg-gradient-to-r from-[var(--landing-navy)] to-[var(--landing-navy)]/90 text-white">
            <h3 className="font-bold text-lg mb-2">
              Wil je AI-feedback op je schrijfwerk?
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Pro-leden krijgen directe feedback op grammatica, woordenschat en schrijfstijl.
            </p>
            <button className="bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Upgrade naar Pro
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
