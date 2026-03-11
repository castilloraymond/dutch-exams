"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Volume2, User } from "lucide-react";
import type { SpeakingTask, SpeakingQuestion } from "@/lib/types";
import { useAzureTTS } from "@/hooks/useAzureTTS";

interface SpeakingPromptProps {
  task: SpeakingTask;
  question?: SpeakingQuestion;
  compact?: boolean;
  autoPlay?: boolean;
}

/**
 * Hook to play pre-generated MP3 audio files with TTS fallback.
 */
function usePregenAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { speak: ttsFallback, stop: ttsStop, isPlaying: ttsPlaying } = useAzureTTS();

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    ttsStop();
    setIsPlaying(false);
  }, [ttsStop]);

  const play = useCallback((audioFile: string | undefined, fallbackText: string) => {
    // Stop any current playback
    stop();

    if (audioFile) {
      // Cache-bust to ensure browser loads latest file
      const bustUrl = audioFile + "?v=2";
      const audio = new Audio(bustUrl);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        ttsFallback(fallbackText);
      };
      setIsPlaying(true);
      audio.play().catch(() => {
        setIsPlaying(false);
        ttsFallback(fallbackText);
      });
    } else {
      // No pre-generated file, use real-time TTS
      ttsFallback(fallbackText);
    }
  }, [stop, ttsFallback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playing = isPlaying || ttsPlaying;

  return { play, stop, isPlaying: playing };
}

export function SpeakingPrompt({ task, question, compact = false, autoPlay = false }: SpeakingPromptProps) {
  const { play, stop, isPlaying } = usePregenAudio();

  // Use question data if provided, otherwise fall back to task-level fields
  const questionNl = question?.questionNl ?? task.questionNl;
  const questionParts = question?.questionParts ?? task.questionParts;
  const personStatementNl = question?.personStatementNl ?? task.personStatementNl;
  const images = question?.images ?? task.images;
  const sequencingWordsRequired = question?.sequencingWordsRequired ?? task.sequencingWordsRequired;

  // Audio file references (prefer question-level, fall back to task-level)
  const questionAudioFile = question?.questionAudioFile ?? task.questionAudioFile;
  const personStatementAudioFile = question?.personStatementAudioFile ?? task.personStatementAudioFile;

  // Auto-play when component mounts and autoPlay is true
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setTimeout(() => {
      if (personStatementNl) {
        play(personStatementAudioFile, personStatementNl);
      } else if (questionNl) {
        play(questionAudioFile, questionNl);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      stop();
    };
    // Only run on mount / when autoPlay changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  // Part 1: Personal questions with TTS
  if (task.partNumber === 1 && personStatementNl) {
    return (
      <div className={`space-y-4 ${compact ? "space-y-3" : ""}`}>
        {/* Person statement */}
        <div className="landing-card p-4 bg-[var(--ink)]/5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
              <User className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div className="flex-1">
              <p className="text-[var(--ink)] font-medium">
                {personStatementNl}
              </p>
            </div>
            <button
              onClick={() => {
                if (isPlaying) {
                  stop();
                } else {
                  play(personStatementAudioFile, personStatementNl);
                }
              }}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isPlaying
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20"
              }`}
              aria-label={isPlaying ? "Stop audio" : "Play audio"}
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Question */}
        <div className={compact ? "" : "pt-2"}>
          <h2 className="font-bold text-[var(--ink)] mb-1">
            {questionNl}
          </h2>
          {questionParts && (
            <div className="mt-3 p-3 bg-[var(--accent)]/10 rounded-lg">
              <p className="text-xs font-medium text-[var(--ink)]/70 mb-2">
                Beantwoord beide delen:
              </p>
              <ul className="text-sm text-[var(--ink)] space-y-1">
                {questionParts.map((part, idx) => (
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
      {images && images.length > 0 && (
        <div
          className={`grid gap-3 ${
            images.length === 1
              ? "grid-cols-1"
              : images.length === 2
              ? "grid-cols-2"
              : "grid-cols-3"
          }`}
        >
          {images.map((image) => {
            const isPlaceholder = image.src.includes("placeholder");

            if (isPlaceholder) {
              return (
                <div key={image.id} className="relative">
                  <div className="aspect-square rounded-lg border-2 border-dashed border-[var(--ink)]/20 bg-[var(--ink)]/5 flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-sm font-medium text-[var(--ink)]/80">
                      {image.altNl}
                    </p>
                  </div>
                  {image.label && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-medium text-[var(--ink)]">
                      {image.label}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={image.id} className="relative">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={image.src}
                    alt={image.altNl}
                    fill
                    className="object-cover"
                  />
                </div>
                {image.label && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-medium text-[var(--ink)]">
                    {image.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Question with play button */}
      <div className={compact ? "" : "pt-2"}>
        <div className="flex items-start gap-2">
          <h2 className="font-bold text-[var(--ink)] mb-1 flex-1">
            {questionNl}
          </h2>
          <button
            onClick={() => {
              if (isPlaying) {
                stop();
              } else {
                play(questionAudioFile, questionNl);
              }
            }}
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isPlaying
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20"
            }`}
            aria-label={isPlaying ? "Stop audio" : "Play question audio"}
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
        {questionParts && (
          <div className="mt-3 p-3 bg-[var(--accent)]/10 rounded-lg">
            <p className="text-xs font-medium text-[var(--ink)]/70 mb-2">
              Beantwoord beide delen:
            </p>
            <ul className="text-sm text-[var(--ink)] space-y-1">
              {questionParts.map((part, idx) => (
                <li key={idx}>
                  {idx + 1}. {part}
                </li>
              ))}
            </ul>
          </div>
        )}
        {sequencingWordsRequired && (
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
