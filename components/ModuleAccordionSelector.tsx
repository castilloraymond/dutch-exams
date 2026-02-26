"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Landmark,
  Headphones,
  PenLine,
  Mic,
  ArrowLeft,
  ChevronDown,
  Check,
  Lock,
} from "lucide-react";
import { MockupNote } from "./MockupNote";
import type { MockExamSummary, Difficulty, ExamCompletion } from "@/lib/types";

type Module = "lezen" | "knm" | "luisteren" | "schrijven" | "spreken";

interface Props {
  module: Module;
  exams: MockExamSummary[];
  examProgress: Record<string, ExamCompletion>;
  isPremium?: boolean;
}

const MODULE_CONFIG: Record<
  Module,
  { title: string; titleEn: string; Icon: React.ElementType }
> = {
  lezen:     { title: "Lezen",     titleEn: "Reading",       Icon: BookOpen   },
  knm:       { title: "KNM",       titleEn: "Dutch Society", Icon: Landmark   },
  luisteren: { title: "Luisteren", titleEn: "Listening",     Icon: Headphones },
  schrijven: { title: "Schrijven", titleEn: "Writing",       Icon: PenLine    },
  spreken:   { title: "Spreken",   titleEn: "Speaking",      Icon: Mic        },
};

const LEVELS = [
  {
    difficulty: "A1" as Difficulty,
    label: "Beginner",
    desc: "Eenvoudige teksten en basis woordenschat",
    descEn: "Simple texts and basic vocabulary",
    color: "var(--green)",
    softColor: "var(--green-soft)",
  },
  {
    difficulty: "A2" as Difficulty,
    label: "Intermediate",
    desc: "Standaard examenniveau",
    descEn: "Standard exam level",
    color: "var(--accent)",
    softColor: "var(--accent-soft)",
  },
  {
    difficulty: "B1" as Difficulty,
    label: "Advanced",
    desc: "Gevorderd examenniveau",
    descEn: "Advanced exam level",
    color: "var(--blue)",
    softColor: "var(--blue-soft)",
  },
];

// Strip the module+difficulty prefix, e.g. "Lezen A1 - Oefenexamen 1" → "Oefenexamen 1"
function formatExamTitle(title: string): string {
  return title.replace(/^\S+\s+[A-Z0-9]+\s*-\s*/i, "");
}

function sortExams(
  exams: MockExamSummary[],
  examProgress: Record<string, ExamCompletion>
) {
  return {
    notStarted: exams.filter((e) => !examProgress[e.id]),
    completed: exams.filter((e) => !!examProgress[e.id]),
  };
}

// ─── Exam Row ─────────────────────────────────────────────────────────────────

interface ExamRowProps {
  exam: MockExamSummary;
  href: string;
  completion: ExamCompletion | undefined;
  isPremium?: boolean;
  color: string;
}

function ExamRow({ exam, href, completion, isPremium, color }: ExamRowProps) {
  const isCompleted = !!completion;
  const isLocked = !exam.isFreePreview && !isPremium;
  const score = completion
    ? Math.round((completion.correctAnswers / completion.totalQuestions) * 100)
    : null;

  const ringSize = 32;
  const r = 11;
  const circumference = 2 * Math.PI * r;

  return (
    <Link href={isLocked ? "/upgrade" : href}>
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:-translate-y-px hover:shadow-sm transition-all cursor-pointer">
        {/* Status ring */}
        <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
          <svg
            width={ringSize}
            height={ringSize}
            viewBox={`0 0 ${ringSize} ${ringSize}`}
            className="absolute inset-0 -rotate-90"
          >
            <circle cx={ringSize / 2} cy={ringSize / 2} r={r} fill="none"
              stroke="var(--ink)" strokeOpacity={0.1} strokeWidth={3} />
            <circle cx={ringSize / 2} cy={ringSize / 2} r={r} fill="none"
              stroke={isCompleted ? color : "transparent"} strokeWidth={3}
              strokeDasharray={circumference}
              strokeDashoffset={isCompleted ? 0 : circumference}
              strokeLinecap="round" />
          </svg>
          {isCompleted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check className="h-3.5 w-3.5" style={{ color }} />
            </div>
          )}
          {isLocked && !isCompleted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="h-3 w-3 text-[var(--ink)]/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[var(--ink)] truncate">
              {formatExamTitle(exam.title)}
            </span>
            {exam.isFreePreview && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[var(--green)]/10 text-[var(--green)]">
                Gratis · Free
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--ink)]/50 mt-0.5">
            <span>{exam.questionCount} vragen · {exam.recommendedTime}</span>
            <span className="text-[var(--ink)]/30">({exam.questionCount} questions)</span>
            {score !== null && (
              <span className="font-medium" style={{ color: score >= 60 ? "var(--green)" : "var(--accent)" }}>
                {score}%
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          {isLocked ? (
            <span className="text-xs px-2.5 py-1 rounded-full border border-[var(--ink)]/20 text-[var(--ink)]/40">
              Upgrade
            </span>
          ) : isCompleted ? (
            <div className="text-center">
              <span className="text-xs px-2.5 py-1 rounded-full border border-[var(--ink)]/20 text-[var(--ink)]/50 block">
                Opnieuw
              </span>
              <span className="text-[10px] text-[var(--ink)]/30">Retry</span>
            </div>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full border font-medium"
              style={{ borderColor: color, color }}>
              Start →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Desktop Level Card (Accordion) ──────────────────────────────────────────

interface LevelCardProps {
  level: (typeof LEVELS)[number];
  module: Module;
  exams: MockExamSummary[];
  examProgress: Record<string, ExamCompletion>;
  isPremium?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  showCompleted: boolean;
  onToggleCompleted: () => void;
}

function LevelCard({
  level, module, exams, examProgress, isPremium,
  isExpanded, onToggle, showCompleted, onToggleCompleted,
}: LevelCardProps) {
  const { notStarted, completed } = sortExams(exams, examProgress);
  const totalCount = exams.length;
  const completedCount = completed.length;

  const ringSize = 64;
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  const strokeOffset = circumference * (1 - progress);

  const previewExams = [...notStarted, ...completed].slice(0, 2);
  const moreCount = totalCount - 2;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        border: isExpanded
          ? `2px solid color-mix(in srgb, ${level.color} 20%, transparent)`
          : "2px solid transparent",
        boxShadow: isExpanded
          ? `0 4px 16px color-mix(in srgb, ${level.color} 10%, transparent)`
          : undefined,
        background: "white",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 cursor-pointer select-none" onClick={onToggle}>
        {/* Progress ring */}
        <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}
            className="absolute inset-0 -rotate-90">
            <circle cx={ringSize / 2} cy={ringSize / 2} r={r} fill="none"
              stroke="var(--ink)" strokeOpacity={0.1} strokeWidth={5} />
            <circle cx={ringSize / 2} cy={ringSize / 2} r={r} fill="none"
              stroke={level.color} strokeWidth={5}
              strokeDasharray={circumference} strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s ease" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ fontSize: "13px", fontWeight: 800, color: level.color, letterSpacing: "-0.02em" }}>
              {level.difficulty}
            </span>
          </div>
        </div>

        {/* Label + descriptions + mini bar */}
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-[var(--ink)]">{level.label}</span>
          <p className="text-xs text-[var(--ink)]/50 mt-0.5">{level.desc}</p>
          <p className="text-[10px] text-[var(--ink)]/30">{level.descEn}</p>
          <div className="mt-2 h-[3px] max-w-[160px] rounded-full bg-[var(--ink)]/10">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ background: level.color, width: `${progress * 100}%` }} />
          </div>
        </div>

        {/* Count + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right">
            <span className="text-sm font-medium" style={{ color: level.color }}>
              {completedCount}/{totalCount}
            </span>
            <p className="text-[10px] text-[var(--ink)]/30">afgerond</p>
            <p className="text-[10px] text-[var(--ink)]/25">completed</p>
          </div>
          <ChevronDown
            className="h-4 w-4 text-[var(--ink)]/40 transition-transform duration-300"
            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
      </div>

      {/* Collapsed preview */}
      {!isExpanded && totalCount > 0 && (
        <div className="relative cursor-pointer" style={{ maxHeight: 120, overflow: "hidden" }} onClick={onToggle}>
          <div className="px-4 pb-2 space-y-1 pointer-events-none">
            {previewExams.map((exam, i) => (
              <div key={exam.id} style={{ opacity: i === 0 ? 1 : 0.45 }}>
                <ExamRow exam={exam} href={`/learn/${module}/mock/${exam.id}`}
                  completion={examProgress[exam.id]} isPremium={isPremium} color={level.color} />
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{ height: 60, background: `linear-gradient(to bottom, transparent, ${level.softColor})` }} />
          {moreCount > 0 && (
            <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-semibold"
              style={{ color: level.color }}>
              + {moreCount} meer {moreCount === 1 ? "examen" : "examens"}
            </div>
          )}
        </div>
      )}

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {notStarted.length > 0 && (
            <div className="space-y-1">
              {notStarted.map((exam) => (
                <ExamRow key={exam.id} exam={exam} href={`/learn/${module}/mock/${exam.id}`}
                  completion={undefined} isPremium={isPremium} color={level.color} />
              ))}
            </div>
          )}
          {completed.length > 0 && (
            <div className="mt-2">
              <button
                className="text-xs text-[var(--ink)]/40 hover:text-[var(--ink)]/60 transition-colors py-1"
                onClick={(e) => { e.stopPropagation(); onToggleCompleted(); }}
              >
                {showCompleted
                  ? "Verberg afgerond · Hide completed"
                  : `Toon afgerond (${completed.length}) · Show completed`}
              </button>
              {showCompleted && (
                <div className="space-y-1 mt-1" style={{ opacity: 0.6 }}>
                  {completed.map((exam) => (
                    <ExamRow key={exam.id} exam={exam} href={`/learn/${module}/mock/${exam.id}`}
                      completion={examProgress[exam.id]} isPremium={isPremium} color={level.color} />
                  ))}
                </div>
              )}
            </div>
          )}
          {notStarted.length === 0 && completed.length === 0 && (
            <p className="text-sm text-[var(--ink)]/40 py-2">
              Geen examens beschikbaar · No exams available
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mobile Tab View ──────────────────────────────────────────────────────────

interface MobileTabViewProps {
  module: Module;
  exams: MockExamSummary[];
  examProgress: Record<string, ExamCompletion>;
  isPremium?: boolean;
}

function MobileTabView({ module, exams, examProgress, isPremium }: MobileTabViewProps) {
  const [activeLevel, setActiveLevel] = useState<Difficulty>("A1");
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const first = LEVELS.find((level) => {
      const levelExams = exams.filter((e) => e.difficulty === level.difficulty);
      return levelExams.some((e) => !examProgress[e.id]);
    });
    if (first) setActiveLevel(first.difficulty);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeConfig = LEVELS.find((l) => l.difficulty === activeLevel)!;
  const levelExams = exams.filter((e) => e.difficulty === activeLevel);
  const { notStarted, completed } = sortExams(levelExams, examProgress);

  return (
    <div>
      {/* Segmented tabs */}
      <div className="flex gap-2 mb-4 p-1 rounded-xl bg-[var(--ink)]/5">
        {LEVELS.map((level) => {
          const lvlExams = exams.filter((e) => e.difficulty === level.difficulty);
          if (lvlExams.length === 0) return null;
          const isActive = activeLevel === level.difficulty;
          const lvlCompleted = lvlExams.filter((e) => !!examProgress[e.id]).length;

          return (
            <button
              key={level.difficulty}
              onClick={() => { setActiveLevel(level.difficulty); setShowCompleted(false); }}
              className="flex-1 py-2 px-1 rounded-lg text-center transition-all duration-200"
              style={{
                background: isActive ? "white" : "transparent",
                boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.08)" : undefined,
              }}
            >
              <div className="text-xs font-bold"
                style={{ color: isActive ? level.color : "var(--ink)" }}>
                {level.difficulty}
              </div>
              <div className="text-[10px] mt-0.5"
                style={{ color: isActive ? level.color : "var(--ink)", opacity: isActive ? 0.7 : 0.4 }}>
                {lvlCompleted}/{lvlExams.length}
              </div>
            </button>
          );
        })}
      </div>

      {/* Level description */}
      <div className="mb-3">
        <p className="text-xs text-[var(--ink)]/50">{activeConfig.desc}</p>
        <p className="text-[10px] text-[var(--ink)]/30">{activeConfig.descEn}</p>
      </div>

      {/* Exam list */}
      <div className="rounded-xl overflow-hidden"
        style={{ background: "white", border: `2px solid color-mix(in srgb, ${activeConfig.color} 15%, transparent)` }}>
        {notStarted.length > 0 && (
          <div className="p-2 space-y-1">
            {notStarted.map((exam) => (
              <ExamRow key={exam.id} exam={exam} href={`/learn/${module}/mock/${exam.id}`}
                completion={undefined} isPremium={isPremium} color={activeConfig.color} />
            ))}
          </div>
        )}
        {completed.length > 0 && (
          <div className="px-2 pb-2">
            {notStarted.length > 0 && <div className="border-t border-[var(--ink)]/5 my-1" />}
            <button
              className="text-xs text-[var(--ink)]/40 hover:text-[var(--ink)]/60 transition-colors py-1.5 px-1"
              onClick={() => setShowCompleted((v) => !v)}
            >
              {showCompleted
                ? "Verberg afgerond · Hide completed"
                : `Toon afgerond (${completed.length}) · Show completed`}
            </button>
            {showCompleted && (
              <div className="space-y-1 mt-1" style={{ opacity: 0.6 }}>
                {completed.map((exam) => (
                  <ExamRow key={exam.id} exam={exam} href={`/learn/${module}/mock/${exam.id}`}
                    completion={examProgress[exam.id]} isPremium={isPremium} color={activeConfig.color} />
                ))}
              </div>
            )}
          </div>
        )}
        {notStarted.length === 0 && completed.length === 0 && (
          <p className="text-sm text-[var(--ink)]/40 p-4">
            Geen examens beschikbaar · No exams available
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function ModuleAccordionSelector({ module, exams, examProgress, isPremium }: Props) {
  const { title, titleEn, Icon } = MODULE_CONFIG[module];

  const [headerVisible, setHeaderVisible] = useState(true);
  const [expandedLevel, setExpandedLevel] = useState<Difficulty | null>(null);
  const [showCompleted, setShowCompleted] = useState<Record<Difficulty, boolean>>({
    A1: false, A2: false, B1: false,
  });

  useEffect(() => {
    const firstIncomplete = LEVELS.find((level) => {
      const levelExams = exams.filter((e) => e.difficulty === level.difficulty);
      return levelExams.some((e) => !examProgress[e.id]);
    });
    setExpandedLevel(firstIncomplete?.difficulty ?? null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setHeaderVisible(currentY < lastY || currentY < 60);
      lastY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const completedCount = Object.keys(examProgress).filter((id) =>
    exams.some((e) => e.id === id)
  ).length;
  const totalCount = exams.length;
  const overallProgress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      <header
        className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10 transition-transform duration-300"
        style={{ transform: headerVisible ? "translateY(0)" : "translateY(-100%)" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/learn"
              className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors cursor-pointer">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-[var(--accent)]" />
              <h1 className="text-xl font-bold text-[var(--ink)]">{title}</h1>
              <span className="text-sm text-[var(--ink)]/40">· {titleEn}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-4">
              <Icon className="h-8 w-8 text-[var(--accent)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-1">Kies je niveau</h2>
            <p className="text-sm text-[var(--ink)]/40 mb-4">Choose your level</p>

            {/* Overall progress pill */}
            <div className="inline-flex flex-col items-center gap-1.5">
              <span className="text-sm text-[var(--ink)]/60">
                <span className="font-semibold text-[var(--ink)]">{completedCount}</span>
                /{totalCount}{" "}
                afgerond <span className="text-[var(--ink)]/35">(completed)</span>
              </span>
              <div className="w-32 h-1.5 rounded-full bg-[var(--ink)]/10">
                <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                  style={{ width: `${overallProgress * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <MockupNote />
          </div>

          {/* Mobile: segmented tabs */}
          <div className="md:hidden">
            <MobileTabView module={module} exams={exams} examProgress={examProgress} isPremium={isPremium} />
          </div>

          {/* Desktop: accordion */}
          <div className="hidden md:block space-y-4">
            {LEVELS.map((level) => {
              const levelExams = exams.filter((e) => e.difficulty === level.difficulty);
              if (levelExams.length === 0) return null;
              return (
                <LevelCard
                  key={level.difficulty}
                  level={level}
                  module={module}
                  exams={levelExams}
                  examProgress={examProgress}
                  isPremium={isPremium}
                  isExpanded={expandedLevel === level.difficulty}
                  onToggle={() => setExpandedLevel((p) => p === level.difficulty ? null : level.difficulty)}
                  showCompleted={showCompleted[level.difficulty]}
                  onToggleCompleted={() =>
                    setShowCompleted((p) => ({ ...p, [level.difficulty]: !p[level.difficulty] }))
                  }
                />
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
