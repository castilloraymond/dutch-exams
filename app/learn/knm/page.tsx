"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { getKNMIndex } from "@/lib/content";
import { ArrowLeft, Briefcase, Home, HeartPulse, Landmark, GraduationCap, Scale, MapPin, CheckCircle2 } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "briefcase": Briefcase,
  "home": Home,
  "heart-pulse": HeartPulse,
  "landmark": Landmark,
  "graduation-cap": GraduationCap,
  "scale": Scale,
  "map-pin": MapPin,
};

export default function KNMPage() {
  const { progress, isLoaded } = useProgress();
  const knmIndex = getKNMIndex();

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
              <Landmark className="h-5 w-5 text-[var(--landing-orange)]" />
              <h1 className="text-xl font-bold font-sans-landing text-[var(--landing-navy)]">KNM (Kennis Nederlandse Maatschappij)</h1>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-serif text-[var(--landing-navy)] mb-2">Kies een onderwerp</h2>
            <p className="text-[var(--landing-navy)]/60">
              Test je kennis over de Nederlandse maatschappij. 8 onderwerpen, 96 vragen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoaded ? (
              knmIndex.topics.map((topic) => {
                const Icon = iconMap[topic.icon] || Landmark;
                const progressKey = `knm-${topic.id}`;
                const topicProgress = progress.passageProgress[progressKey];
                const isComplete = topicProgress?.completed;

                return (
                  <div key={topic.id} className="landing-card p-4 sm:p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--landing-orange)]/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[var(--landing-orange)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--landing-navy)]">{topic.title}</h3>
                          {isComplete && (
                            <CheckCircle2 className="h-4 w-4 text-[var(--landing-green)] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-[var(--landing-navy)]/60">{topic.description}</p>
                        <p className="text-xs text-[var(--landing-navy)]/50 mt-1">
                          {topic.questionCount} vragen
                          {topicProgress && !isComplete && (
                            <> &middot; {topicProgress.questionsAnswered.length}/{topicProgress.totalQuestions} beantwoord</>
                          )}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Link
                            href={`/learn/knm/${topic.id}?mode=practice`}
                            className="text-xs font-medium px-3 py-1.5 rounded-md bg-[var(--landing-navy)]/10 text-[var(--landing-navy)] hover:bg-[var(--landing-navy)]/20 transition-colors"
                          >
                            Practice
                          </Link>
                          <Link
                            href={`/learn/knm/${topic.id}?mode=exam`}
                            className="text-xs font-medium px-3 py-1.5 rounded-md bg-[var(--landing-orange)]/10 text-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/20 transition-colors"
                          >
                            Exam
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-32 bg-[var(--landing-navy)]/5 animate-pulse rounded-2xl" />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
