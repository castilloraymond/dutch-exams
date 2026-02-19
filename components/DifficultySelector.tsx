"use client";

import { BookOpen, Landmark, Headphones, PenLine, Mic, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ExamCard } from "./ExamCard";
import { MockupNote } from "./MockupNote";
import type { MockExamSummary, Difficulty } from "@/lib/types";

interface DifficultySelectorProps {
  module: "lezen" | "knm" | "luisteren" | "schrijven" | "spreken";
  exams: MockExamSummary[];
  completedExams?: Record<string, number>; // examId -> lastScore
  isPremium?: boolean;
}

const moduleConfig = {
  lezen: {
    title: "Lezen",
    titleEn: "Reading",
    subtitle: "Kies je niveau",
    subtitleEn: "Choose your level",
    icon: BookOpen,
    color: "text-[var(--accent)]",
    bgColor: "bg-[var(--accent)]/10",
  },
  knm: {
    title: "KNM",
    titleEn: "Dutch Society",
    subtitle: "Kies je niveau",
    subtitleEn: "Choose your level",
    icon: Landmark,
    color: "text-[var(--accent)]",
    bgColor: "bg-[var(--accent)]/10",
  },
  luisteren: {
    title: "Luisteren",
    titleEn: "Listening",
    subtitle: "Kies je niveau",
    subtitleEn: "Choose your level",
    icon: Headphones,
    color: "text-[var(--accent)]",
    bgColor: "bg-[var(--accent)]/10",
  },
  schrijven: {
    title: "Schrijven",
    titleEn: "Writing",
    subtitle: "Kies je niveau",
    subtitleEn: "Choose your level",
    icon: PenLine,
    color: "text-[var(--accent)]",
    bgColor: "bg-[var(--accent)]/10",
  },
  spreken: {
    title: "Spreken",
    titleEn: "Speaking",
    subtitle: "Kies je niveau",
    subtitleEn: "Choose your level",
    icon: Mic,
    color: "text-[var(--accent)]",
    bgColor: "bg-[var(--accent)]/10",
  },
};

const difficultyInfo: Record<Difficulty, { title: string; description: string; descriptionEn: string }> = {
  A1: {
    title: "A1 - Beginner",
    description: "Eenvoudige teksten en basis woordenschat",
    descriptionEn: "Simple texts and basic vocabulary",
  },
  A2: {
    title: "A2 - Intermediate",
    description: "Standaard examenniveau",
    descriptionEn: "Standard exam level",
  },
  B1: {
    title: "B1 - Advanced",
    description: "Gevorderd examenniveau",
    descriptionEn: "Advanced exam level",
  },
};

export function DifficultySelector({ module, exams, completedExams = {}, isPremium }: DifficultySelectorProps) {
  const config = moduleConfig[module];
  const Icon = config.icon;

  // Group exams by difficulty
  const a1Exams = exams.filter((e) => e.difficulty === "A1");
  const a2Exams = exams.filter((e) => e.difficulty === "A2");
  const b1Exams = exams.filter((e) => e.difficulty === "B1");

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/learn"
              className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${config.color}`} />
              <h1 className="text-xl font-bold text-[var(--ink)]">
                {config.title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto rounded-full ${config.bgColor} flex items-center justify-center mb-4`}>
              <Icon className={`h-8 w-8 ${config.color}`} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-1">
              {config.subtitle}
            </h2>
            <p className="text-sm text-[var(--ink)]/40 mb-2">{config.subtitleEn}</p>
            <p className="text-[var(--ink)]/60">
              Selecteer een examenniveau en oefentoets
            </p>
            <p className="text-sm text-[var(--ink)]/40">
              Select an exam level and practice test
            </p>
          </div>

          <div className="mb-6">
            <MockupNote />
          </div>

          <div className="space-y-8">
            {/* A1 Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--green)]/10 text-[var(--green)]">
                  A1
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--ink)]">
                    {difficultyInfo.A1.title}
                  </h3>
                  <p className="text-sm text-[var(--ink)]/60">
                    {difficultyInfo.A1.description}
                  </p>
                  <p className="text-xs text-[var(--ink)]/40">
                    {difficultyInfo.A1.descriptionEn}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {a1Exams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    href={`/learn/${module}/mock/${exam.id}`}
                    completed={exam.id in completedExams}
                    lastScore={completedExams[exam.id]}
                    isPremium={isPremium}
                  />
                ))}
              </div>
            </div>

            {/* A2 Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                  A2
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--ink)]">
                    {difficultyInfo.A2.title}
                  </h3>
                  <p className="text-sm text-[var(--ink)]/60">
                    {difficultyInfo.A2.description}
                  </p>
                  <p className="text-xs text-[var(--ink)]/40">
                    {difficultyInfo.A2.descriptionEn}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {a2Exams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    href={`/learn/${module}/mock/${exam.id}`}
                    completed={exam.id in completedExams}
                    lastScore={completedExams[exam.id]}
                    isPremium={isPremium}
                  />
                ))}
              </div>
            </div>

            {/* B1 Section */}
            {b1Exams.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--blue)]/10 text-[var(--blue)]">
                    B1
                  </span>
                  <div>
                    <h3 className="font-semibold text-[var(--ink)]">
                      {difficultyInfo.B1.title}
                    </h3>
                    <p className="text-sm text-[var(--ink)]/60">
                      {difficultyInfo.B1.description}
                    </p>
                    <p className="text-xs text-[var(--ink)]/40">
                      {difficultyInfo.B1.descriptionEn}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {b1Exams.map((exam) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      href={`/learn/${module}/mock/${exam.id}`}
                      completed={exam.id in completedExams}
                      lastScore={completedExams[exam.id]}
                      isPremium={isPremium}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
