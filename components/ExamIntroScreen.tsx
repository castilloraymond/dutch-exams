"use client";

import { AudioPlayer } from "@/components/AudioPlayer";
import { ChevronRight } from "lucide-react";

type ExamModule = "lezen" | "knm" | "luisteren" | "schrijven" | "spreken";

interface ExamIntroScreenProps {
  title: string;
  questionCount: number;
  recommendedTime?: string;
  onStart: () => void;
  showAudioTest?: boolean;
  module?: ExamModule;
}

function getModuleInstructions(
  module: ExamModule,
  questionCount: number
): { welcome: string; instructions: string[] } {
  switch (module) {
    case "lezen":
      return {
        welcome: "Welkom bij het oefenexamen Lezen",
        instructions: [
          `U moet in dit examen ${questionCount} vragen beantwoorden.`,
          "Lees de teksten goed door voordat u de vragen beantwoordt.",
          "Wilt u met het examen beginnen, klik dan op \u2018Start\u2019.",
        ],
      };
    case "knm":
      return {
        welcome: "Welkom bij het oefenexamen KNM",
        instructions: [
          `U moet in dit examen ${questionCount} vragen beantwoorden over de Nederlandse maatschappij.`,
          "Lees elke vraag goed door voordat u een antwoord kiest.",
          "Wilt u met het examen beginnen, klik dan op \u2018Start\u2019.",
        ],
      };
    case "luisteren":
      return {
        welcome: "Welkom bij het oefenexamen Luisteren",
        instructions: [
          `Dit examen bevat ${questionCount} vragen.`,
          "U hoort audiofragmenten en beantwoordt daarna de vragen.",
          "Test uw geluid voordat u begint.",
          "Wilt u met het examen beginnen, klik dan op \u2018Start\u2019.",
        ],
      };
    case "schrijven":
      return {
        welcome: "Welkom bij het oefenexamen Schrijven",
        instructions: [
          `Dit examen bevat ${questionCount} schrijfopdrachten.`,
          "Schrijf uw antwoorden in het Nederlands.",
          "Wilt u met het examen beginnen, klik dan op \u2018Start\u2019.",
        ],
      };
    case "spreken":
      return {
        welcome: "Welkom bij het oefenexamen Spreken",
        instructions: [
          `Dit examen bevat ${questionCount} spreekopdrachten.`,
          "U heeft een werkende microfoon nodig voor dit examen.",
          "Test uw geluid voordat u begint.",
          "Wilt u met het examen beginnen, klik dan op \u2018Start\u2019.",
        ],
      };
  }
}

export function ExamIntroScreen({
  title,
  questionCount,
  recommendedTime,
  onStart,
  showAudioTest,
  module = "lezen",
}: ExamIntroScreenProps) {
  const minutes = recommendedTime?.match(/(\d+)/)?.[1] || null;
  const { welcome, instructions } = getModuleInstructions(module, questionCount);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cream)]">
      {/* Header bar */}
      <header className="bg-[var(--ink)] text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-base font-semibold">{title}</h1>
        </div>
      </header>

      {/* Content area — two panels */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left panel — instructions */}
        <div className="flex-1 bg-white/80 p-6 sm:p-8 lg:p-10 lg:border-r border-[var(--ink)]/10">
          <div className="max-w-lg">
            <h2 className="text-xl font-bold text-[var(--ink)] mb-4">
              {welcome}
            </h2>

            <div className="space-y-3 text-[var(--ink)]/80">
              {instructions.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <p className="mt-6 text-sm text-[var(--ink)]/50">
              Je krijgt geen feedback tijdens het examen. Je ziet je resultaten
              aan het einde.
            </p>

            <div className="mt-12 text-sm text-[var(--ink)]/50 italic leading-relaxed">
              <p>
                Dit is een oefenexamen ter voorbereiding op het
                inburgeringsexamen. De inhoud is gebaseerd op het offici&euml;le
                examenformat.
              </p>
            </div>
          </div>
        </div>

        {/* Right panel — stats */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10">
          <div className="max-w-lg mx-auto lg:mx-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] mb-8">
              {title}
            </h2>

            {/* Stat boxes */}
            <div className="flex gap-4 sm:gap-6 mb-8">
              <div className="flex-1 max-w-[160px] rounded-xl border-2 border-[var(--accent)]/30 overflow-hidden shadow-sm">
                <div className="bg-white p-4 sm:p-6 text-center">
                  <span className="text-4xl sm:text-5xl font-bold text-[var(--ink)]">
                    {questionCount}
                  </span>
                </div>
                <div className="bg-[var(--accent)] text-white text-center py-2 px-2">
                  <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">
                    {module === "schrijven"
                      ? "Opdrachten"
                      : module === "spreken"
                        ? "Opdrachten"
                        : "Vragen"}
                  </span>
                </div>
              </div>

              {minutes && (
                <div className="flex-1 max-w-[160px] rounded-xl border-2 border-[var(--accent)]/30 overflow-hidden shadow-sm">
                  <div className="bg-white p-4 sm:p-6 text-center">
                    <span className="text-4xl sm:text-5xl font-bold text-[var(--ink)]">
                      {minutes}
                    </span>
                  </div>
                  <div className="bg-[var(--accent)] text-white text-center py-2 px-2">
                    <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">
                      Minuten
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Audio test section */}
            {showAudioTest && (
              <div>
                <hr className="border-[var(--ink)]/10 mb-6" />
                <h3 className="text-lg font-bold text-[var(--ink)] mb-3">
                  Audiovolume testen
                </h3>
                <AudioPlayer audioSrc="/audio/test-audio.wav" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar with start button */}
      <div className="sticky bottom-0 bg-[var(--ink)] border-t border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-end">
          <button
            onClick={onStart}
            className="bg-[var(--accent)] hover:bg-[var(--accent-glow)] text-white px-8 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            START
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
