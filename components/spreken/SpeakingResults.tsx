"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Check, Lock, Lightbulb, Clock, Volume2, FileText, Eye, EyeOff } from "lucide-react";
import type { SpeakingTask } from "@/lib/types";

interface SpeakingResultsProps {
  task: SpeakingTask;
  audioUrl: string | null;
  recordingTime: number;
  checkedCriteria: string[];
  modelAnswerPlayed: boolean;
  onModelAnswerPlayed: () => void;
  onRetry: () => void;
  onComplete: () => void;
}

export function SpeakingResults({
  task,
  audioUrl,
  recordingTime,
  checkedCriteria,
  onModelAnswerPlayed,
  onRetry,
  onComplete,
}: SpeakingResultsProps) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const score = checkedCriteria.length;
  const total = task.selfAssessmentCriteria.length;
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 60;

  // Call onComplete when component mounts
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const playModelAnswer = () => {
    if (isPlayingModel) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      window.speechSynthesis.cancel();
      setIsPlayingModel(false);
      return;
    }

    onModelAnswerPlayed();

    // Try audio file first
    if (task.modelAnswer.audioFile && audioRef.current) {
      audioRef.current.play();
      setIsPlayingModel(true);
    } else {
      // Fallback to TTS
      const utterance = new SpeechSynthesisUtterance(task.modelAnswer.transcriptNl);
      utterance.lang = "nl-NL";
      utterance.rate = 0.9;

      utterance.onend = () => setIsPlayingModel(false);
      utterance.onerror = () => setIsPlayingModel(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlayingModel(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden audio element for model answer */}
      {task.modelAnswer.audioFile && (
        <audio
          ref={audioRef}
          src={task.modelAnswer.audioFile}
          onEnded={() => setIsPlayingModel(false)}
          onError={() => setIsPlayingModel(false)}
        />
      )}

      {/* Score section */}
      <div className="landing-card p-6 text-center">
        <h2 className="text-xl font-bold text-[var(--landing-navy)] mb-4">
          Zelfbeoordeling
        </h2>

        <div className="flex justify-center items-center gap-4 mb-4">
          <div
            className={`text-5xl font-bold ${
              passed ? "text-green-500" : "text-orange-500"
            }`}
          >
            {score}/{total}
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              passed
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {percentage}%
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[var(--landing-navy)]/60">
          <Clock className="h-4 w-4" />
          <span>Opname: {formatTime(recordingTime)}</span>
        </div>
      </div>

      {/* Conversion hook #1 - After self-assessment */}
      <div className="landing-card p-6 bg-gradient-to-r from-[var(--landing-navy)] to-[var(--landing-navy)]/90 text-white">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">
              Wil je zien wat we hoorden?
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Je gaf jezelf {score}/{total}. Maar hoe was je grammatica echt?
              Pro-leden krijgen hun spraak getranscribeerd en geanalyseerd. Zie
              precies waar je taalgebruik verbeterd kan worden.
            </p>
            <button className="bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Upgrade naar Pro
            </button>
          </div>
        </div>
      </div>

      {/* Your recording vs Model answer */}
      <div className="landing-card p-6">
        <h3 className="font-bold text-[var(--landing-navy)] mb-4">
          Vergelijk met voorbeeldantwoord
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* User's recording */}
          <div className="p-4 rounded-lg bg-[var(--landing-navy)]/5">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="h-4 w-4 text-[var(--landing-navy)]/60" />
              <span className="text-sm font-medium text-[var(--landing-navy)]/60">
                Jouw opname
              </span>
            </div>
            {audioUrl && <audio controls src={audioUrl} className="w-full" />}
          </div>

          {/* Model answer */}
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="h-4 w-4 text-green-700" />
              <span className="text-sm font-medium text-green-700">
                Voorbeeldantwoord
              </span>
            </div>
            <button
              onClick={playModelAnswer}
              className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                isPlayingModel
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {isPlayingModel ? "Stop" : "Luister naar voorbeeld"}
            </button>
          </div>
        </div>

        {/* Transcript toggle */}
        <div className="mt-4 pt-4 border-t border-[var(--landing-navy)]/10">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-2 text-[var(--landing-orange)] hover:text-[var(--landing-orange)]/80 transition-colors"
          >
            {showTranscript ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {showTranscript ? "Verberg transcript" : "Toon transcript"}
            </span>
          </button>

          {showTranscript && (
            <div className="mt-3 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-green-700" />
                <span className="text-sm font-medium text-green-700">
                  Voorbeeldtekst
                </span>
              </div>
              <p className="text-[var(--landing-navy)] mb-2">
                {task.modelAnswer.transcriptNl}
              </p>
              <p className="text-sm text-[var(--landing-navy)]/60 italic">
                {task.modelAnswer.transcript}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips section */}
      <div className="landing-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-[var(--landing-orange)]" />
          <h3 className="font-bold text-[var(--landing-navy)]">Tips</h3>
        </div>
        <ul className="space-y-2">
          {task.tips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-[var(--landing-navy)]"
            >
              <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-[var(--landing-navy)]/60 mt-4 italic">
          Pro-leden krijgen persoonlijke tips op basis van hun specifieke fouten.
        </p>
      </div>

      {/* Locked AI Analysis section - Conversion hook #2 */}
      <div className="landing-card p-6 bg-gray-100 border-2 border-dashed border-gray-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <Lock className="h-4 w-4 text-gray-500" />
          </div>
          <h3 className="font-bold text-gray-500">AI-Analyse</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--landing-orange)] text-white">
            Pro
          </span>
        </div>
        <div className="space-y-3 text-gray-400 text-sm mb-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Transcript:</span>
            <div className="h-4 bg-gray-300 rounded flex-1"></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Grammatica:</span>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Samenhang:</span>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
        <button className="w-full bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
          Ontgrendel met Pro
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetry}
          className="flex-1 border-2 border-[var(--landing-navy)] text-[var(--landing-navy)] hover:bg-[var(--landing-navy)] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Opnieuw proberen
        </button>
        <Link
          href="/learn/spreken"
          className="flex-1 bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
        >
          Ander deel
        </Link>
      </div>
    </div>
  );
}
