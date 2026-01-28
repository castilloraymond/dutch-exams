"use client";

import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/AudioPlayer";
import type { ExamMode } from "@/lib/types";

interface ExamIntroScreenProps {
  title: string;
  questionCount: number;
  mode: ExamMode;
  onStart: () => void;
  /** Show audio test for Luisteren module */
  showAudioTest?: boolean;
}

export function ExamIntroScreen({ title, questionCount, mode, onStart, showAudioTest }: ExamIntroScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--landing-cream)]">
      <div className="landing-card w-full max-w-md p-6 sm:p-8 space-y-6 text-center">
        <div>
          <span className={`inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
            mode === "exam"
              ? "bg-[var(--landing-orange)]/10 text-[var(--landing-orange)]"
              : "bg-[var(--landing-navy)]/10 text-[var(--landing-navy)]"
          }`}>
            {mode === "exam" ? "Exam Simulation" : "Practice Mode"}
          </span>
        </div>

        <h1 className="text-2xl font-bold font-serif text-[var(--landing-navy)]">{title}</h1>

        <p className="text-[var(--landing-navy)]/70">
          {questionCount} {questionCount === 1 ? "vraag" : "vragen"}
        </p>

        {mode === "exam" && (
          <p className="text-sm text-[var(--landing-navy)]/60">
            No feedback will be shown during the exam. You will see your results at the end.
          </p>
        )}

        {showAudioTest && (
          <div className="text-left">
            <p className="text-sm font-medium mb-2 text-[var(--landing-navy)]">Test your audio volume:</p>
            <AudioPlayer text="Dit is een test. Kun je mij horen?" />
          </div>
        )}

        <button onClick={onStart} className="cta-primary w-full py-3 text-base">
          Start
        </button>
      </div>
    </div>
  );
}
