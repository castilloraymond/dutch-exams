"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Lock, Lightbulb, Eye, EyeOff, Clock } from "lucide-react";
import type { WritingTask, FormAnswer } from "@/lib/types";

interface WritingResultsProps {
  task: WritingTask;
  submission: string | FormAnswer;
  checkedCriteria: string[];
  elapsedTime: number;
  modelAnswerRevealed: boolean;
  onRevealModelAnswer: () => void;
  onRetry: () => void;
  onComplete: () => void;
}

export function WritingResults({
  task,
  submission,
  checkedCriteria,
  elapsedTime,
  modelAnswerRevealed,
  onRevealModelAnswer,
  onRetry,
  onComplete,
}: WritingResultsProps) {
  const [showModelAnswer, setShowModelAnswer] = useState(false);

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

  const handleReveal = () => {
    setShowModelAnswer(true);
    onRevealModelAnswer();
  };

  return (
    <div className="space-y-6">
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
          <span>Tijd: {formatTime(elapsedTime)}</span>
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
              Wil je weten wat je echt hebt gemist?
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Je gaf jezelf {score}/{total}. Maar heb je de grammaticafouten
              opgemerkt? Pro-leden krijgen directe AI-feedback op spelling,
              grammatica en woordkeus.
            </p>
            <button className="bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Upgrade naar Pro
            </button>
          </div>
        </div>
      </div>

      {/* Model answer section */}
      <div className="landing-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[var(--landing-navy)]">
            Voorbeeldantwoord
          </h3>
          {!showModelAnswer ? (
            <button
              onClick={handleReveal}
              className="flex items-center gap-2 text-[var(--landing-orange)] hover:text-[var(--landing-orange)]/80 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">Toon antwoord</span>
            </button>
          ) : (
            <button
              onClick={() => setShowModelAnswer(false)}
              className="flex items-center gap-2 text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
            >
              <EyeOff className="h-4 w-4" />
              <span className="text-sm font-medium">Verberg</span>
            </button>
          )}
        </div>

        {showModelAnswer ? (
          <div className="grid md:grid-cols-2 gap-4">
            {/* User's answer */}
            <div className="p-4 rounded-lg bg-[var(--landing-navy)]/5">
              <h4 className="text-sm font-medium text-[var(--landing-navy)]/60 mb-2">
                Jouw antwoord:
              </h4>
              {task.taskType === "form" ? (
                <div className="space-y-1 text-sm">
                  {Object.entries(submission as FormAnswer).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--landing-navy)] whitespace-pre-wrap text-sm">
                  {submission as string}
                </p>
              )}
            </div>

            {/* Model answer */}
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h4 className="text-sm font-medium text-green-700 mb-2">
                Voorbeeldantwoord:
              </h4>
              {task.taskType === "form" ? (
                <div className="space-y-1 text-sm">
                  {Object.entries(task.modelAnswer as FormAnswer).map(
                    ([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-[var(--landing-navy)] whitespace-pre-wrap text-sm">
                  {task.modelAnswer as string}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-[var(--landing-navy)]/60 text-sm">
            Klik op &quot;Toon antwoord&quot; om het voorbeeldantwoord te bekijken en je
            werk te vergelijken.
          </p>
        )}
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

      {/* Locked AI Feedback section - Conversion hook #2 */}
      <div className="landing-card p-6 bg-gray-100 border-2 border-dashed border-gray-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <Lock className="h-4 w-4 text-gray-500" />
          </div>
          <h3 className="font-bold text-gray-500">AI-Feedback</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--landing-orange)] text-white">
            Pro
          </span>
        </div>
        <div className="space-y-2 text-gray-400 text-sm">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
        <button className="mt-4 w-full bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
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
          href="/learn/schrijven"
          className="flex-1 bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
        >
          Andere opdracht
        </Link>
      </div>
    </div>
  );
}
