"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Volume2, User } from "lucide-react";
import type { SpeakingTask } from "@/lib/types";

interface SpeakingPromptProps {
  task: SpeakingTask;
  compact?: boolean;
}

export function SpeakingPrompt({ task, compact = false }: SpeakingPromptProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const playTTS = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(task.personStatementNl || "");
    utterance.lang = "nl-NL";
    utterance.rate = 0.9;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // Part 1: Personal questions with TTS
  if (task.partNumber === 1 && task.personStatementNl) {
    return (
      <div className={`space-y-4 ${compact ? "space-y-3" : ""}`}>
        {/* Person statement */}
        <div className="landing-card p-4 bg-[var(--landing-navy)]/5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--landing-orange)]/20 flex items-center justify-center">
              <User className="h-5 w-5 text-[var(--landing-orange)]" />
            </div>
            <div className="flex-1">
              <p className="text-[var(--landing-navy)] font-medium">
                {task.personStatementNl}
              </p>
              <p className="text-sm text-[var(--landing-navy)]/60 mt-1">
                {task.personStatement}
              </p>
            </div>
            <button
              onClick={playTTS}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isPlaying
                  ? "bg-[var(--landing-orange)] text-white"
                  : "bg-[var(--landing-orange)]/10 text-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/20"
              }`}
              aria-label={isPlaying ? "Stop audio" : "Play audio"}
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Question */}
        <div className={compact ? "" : "pt-2"}>
          <h2 className="font-bold text-[var(--landing-navy)] mb-1">
            {task.questionNl}
          </h2>
          <p className="text-sm text-[var(--landing-navy)]/60">
            {task.questionEn}
          </p>
          {task.questionParts && (
            <div className="mt-3 p-3 bg-[var(--landing-orange)]/10 rounded-lg">
              <p className="text-xs font-medium text-[var(--landing-navy)]/70 mb-2">
                Beantwoord beide delen:
              </p>
              <ul className="text-sm text-[var(--landing-navy)] space-y-1">
                {task.questionParts.map((part, idx) => (
                  <li key={idx}>
                    {idx + 1}. {part}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Parts 2, 3, 4: Image-based prompts
  return (
    <div className={`space-y-4 ${compact ? "space-y-3" : ""}`}>
      {/* Images */}
      {task.images && task.images.length > 0 && (
        <div
          className={`grid gap-3 ${
            task.images.length === 1
              ? "grid-cols-1"
              : task.images.length === 2
              ? "grid-cols-2"
              : "grid-cols-3"
          }`}
        >
          {task.images.map((image) => (
            <div key={image.id} className="relative">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback for missing images
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                {/* Fallback placeholder when image doesn't load */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  {image.altNl}
                </div>
              </div>
              {image.label && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-medium text-[var(--landing-navy)]">
                  {image.label}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Question */}
      <div className={compact ? "" : "pt-2"}>
        <h2 className="font-bold text-[var(--landing-navy)] mb-1">
          {task.questionNl}
        </h2>
        <p className="text-sm text-[var(--landing-navy)]/60">
          {task.questionEn}
        </p>
        {task.questionParts && (
          <div className="mt-3 p-3 bg-[var(--landing-orange)]/10 rounded-lg">
            <p className="text-xs font-medium text-[var(--landing-navy)]/70 mb-2">
              Beantwoord beide delen:
            </p>
            <ul className="text-sm text-[var(--landing-navy)] space-y-1">
              {task.questionParts.map((part, idx) => (
                <li key={idx}>
                  {idx + 1}. {part}
                </li>
              ))}
            </ul>
          </div>
        )}
        {task.sequencingWordsRequired && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Gebruik volgorde woorden: <em>Eerst</em> (First),{" "}
              <em>Daarna</em> (Then), <em>Tenslotte</em> (Finally)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
