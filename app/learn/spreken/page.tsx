"use client";

import Link from "next/link";
import { ArrowLeft, Mic, User, Image, Images, LayoutGrid, Check } from "lucide-react";
import { getSpeakingIndex } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";
import { MockupNote } from "@/components/MockupNote";
import type { SpeakingPartNumber, SpeakingTaskSummary } from "@/lib/types";

const partIcons: Record<SpeakingPartNumber, React.ElementType> = {
  1: User,
  2: Image,
  3: Images,
  4: LayoutGrid,
};

const partDescriptions: Record<SpeakingPartNumber, string> = {
  1: "Beantwoord persoonlijke vragen over je dagelijks leven",
  2: "Beschrijf wat je ziet op een afbeelding",
  3: "Vergelijk twee afbeeldingen en geef je voorkeur",
  4: "Vertel een verhaal over drie afbeeldingen",
};

const partDescriptionsEn: Record<SpeakingPartNumber, string> = {
  1: "Answer personal questions about your daily life",
  2: "Describe what you see in a picture",
  3: "Compare two pictures and give your preference",
  4: "Tell a story about three pictures",
};

export default function SprekenPage() {
  const index = getSpeakingIndex();
  const { progress } = useProgress();

  const a1Tasks = index.tasks.filter((t) => t.difficulty === "A1");
  const a2Tasks = index.tasks.filter((t) => t.difficulty === "A2");

  const renderTaskCard = (task: SpeakingTaskSummary) => {
    const Icon = partIcons[task.partNumber];
    const isCompleted = progress.speakingProgress?.[task.id]?.completedAt;

    return (
      <Link key={task.id} href={`/learn/spreken/${task.id}`}>
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
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--ink)]/10 text-[var(--ink)]/70">
                  Deel {task.partNumber} <span className="text-[var(--ink)]/40">/ Part {task.partNumber}</span>
                </span>
              </div>
              <h3 className="font-semibold text-lg text-[var(--ink)]">
                {task.partTitleNl}
              </h3>
              <p className="text-sm text-[var(--ink)]/60">
                {partDescriptions[task.partNumber]}
              </p>
              <p className="text-xs text-[var(--ink)]/40">
                {partDescriptionsEn[task.partNumber]}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {task.isFreePreview && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    Gratis <span className="text-green-500">/ Free</span>
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
              <Mic className="h-5 w-5 text-[var(--accent)]" />
              <h1 className="text-xl font-bold text-[var(--ink)]">
                Spreken
              </h1>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-1">
              Spreekoefeningen
            </h2>
            <p className="text-sm text-[var(--ink)]/40 mb-2">Speaking Exercises</p>
            <p className="text-[var(--ink)]/60">
              Oefen je Nederlandse spreekvaardigheid met opnameoefeningen per examendeel.
            </p>
            <p className="text-sm text-[var(--ink)]/40">
              Practice your Dutch speaking skills with recording exercises for each exam part.
            </p>
          </div>

          <MockupNote />

          {/* Info banner */}
          <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg p-4">
            <p className="text-sm text-[var(--ink)]">
              <span className="font-semibold">Tip:</span> Use a quiet environment
              for the best recording quality. Speak clearly and at a normal pace.
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
                      Eenvoudige spreekoefeningen
                    </p>
                    <p className="text-xs text-[var(--ink)]/40">
                      Simple speaking exercises
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
                    <p className="text-xs text-[var(--ink)]/40">
                      Standard exam level
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {a2Tasks.map(renderTaskCard)}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
