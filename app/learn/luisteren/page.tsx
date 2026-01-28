"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { getListeningIndex } from "@/lib/content";
import { ArrowLeft, Headphones, CheckCircle2 } from "lucide-react";

export default function LuisterenPage() {
  const { progress, isLoaded } = useProgress();
  const listeningIndex = getListeningIndex();

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
              <Headphones className="h-5 w-5 text-[var(--landing-orange)]" />
              <h1 className="text-xl font-bold font-sans-landing text-[var(--landing-navy)]">Luisteren (Listening)</h1>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-serif text-[var(--landing-navy)] mb-2">Luisteroefeningen</h2>
            <p className="text-[var(--landing-navy)]/60">
              Luister naar het fragment en beantwoord de vragen. Gebruik de afspeelknop om het fragment te horen.
            </p>
          </div>

          <div className="space-y-4">
            {isLoaded ? (
              listeningIndex.exercises.map((exercise) => {
                const progressKey = `luisteren-${exercise.id}`;
                const exerciseProgress = progress.passageProgress[progressKey];
                const isComplete = exerciseProgress?.completed;

                return (
                  <div key={exercise.id} className="landing-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--landing-orange)]/10 flex items-center justify-center">
                          <Headphones className="h-5 w-5 text-[var(--landing-orange)]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[var(--landing-navy)]">{exercise.title}</h3>
                            {isComplete && (
                              <CheckCircle2 className="h-4 w-4 text-[var(--landing-green)]" />
                            )}
                          </div>
                          <p className="text-xs text-[var(--landing-navy)]/50">
                            {exercise.questionCount} vragen
                            {exerciseProgress && !isComplete && (
                              <> &middot; {exerciseProgress.questionsAnswered.length}/{exerciseProgress.totalQuestions} beantwoord</>
                            )}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Link
                              href={`/learn/luisteren/${exercise.id}?mode=practice`}
                              className="text-xs font-medium px-3 py-1.5 rounded-md bg-[var(--landing-navy)]/10 text-[var(--landing-navy)] hover:bg-[var(--landing-navy)]/20 transition-colors"
                            >
                              Practice
                            </Link>
                            <Link
                              href={`/learn/luisteren/${exercise.id}?mode=exam`}
                              className="text-xs font-medium px-3 py-1.5 rounded-md bg-[var(--landing-orange)]/10 text-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/20 transition-colors"
                            >
                              Exam
                            </Link>
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        exercise.difficulty === "A0"
                          ? "bg-[var(--landing-green)]/10 text-[var(--landing-green)]"
                          : "bg-[var(--landing-navy)]/10 text-[var(--landing-navy)]"
                      }`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 bg-[var(--landing-navy)]/5 animate-pulse rounded-2xl" />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
