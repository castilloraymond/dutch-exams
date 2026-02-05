"use client";

import { AudioPlayer } from "@/components/AudioPlayer";

interface ExamIntroScreenProps {
  title: string;
  questionCount: number;
  recommendedTime?: string;
  onStart: () => void;
  showAudioTest?: boolean;
}

export function ExamIntroScreen({
  title,
  questionCount,
  recommendedTime,
  onStart,
  showAudioTest,
}: ExamIntroScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--landing-cream)]">
      <div className="landing-card w-full max-w-md p-6 sm:p-8 space-y-6 text-center">
        <div>
          <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--landing-orange)]/10 text-[var(--landing-orange)]">
            Oefenexamen
          </span>
        </div>

        <h1 className="text-2xl font-bold font-serif text-[var(--landing-navy)]">{title}</h1>

        <div className="space-y-2 text-[var(--landing-navy)]/70">
          <p>{questionCount} vragen</p>
          {recommendedTime && (
            <p className="text-sm">Aanbevolen tijd: {recommendedTime}</p>
          )}
        </div>

        <p className="text-sm text-[var(--landing-navy)]/60">
          Je krijgt geen feedback tijdens het examen. Je ziet je resultaten aan het einde.
        </p>

        {showAudioTest && (
          <div className="text-left">
            <p className="text-sm font-medium mb-2 text-[var(--landing-navy)]">
              Test je geluid:
            </p>
            <AudioPlayer audioSrc="/audio/test-audio.mp3" />
          </div>
        )}

        <button onClick={onStart} className="cta-primary w-full py-3 text-base cursor-pointer">
          Start Examen
        </button>
      </div>
    </div>
  );
}
