"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Check, Lightbulb, Clock, Volume2, FileText, ChevronDown, ChevronUp, Users } from "lucide-react";
import type { SpeakingTask, SpeakingQuestion } from "@/lib/types";
import { useAzureTTS } from "@/hooks/useAzureTTS";

interface RecordedAnswer {
  questionIndex: number;
  audioUrl: string | null;
  recordingTime: number;
}

interface SpeakingResultsProps {
  task: SpeakingTask;
  questions?: SpeakingQuestion[];
  audioUrl: string | null;
  recordingTime: number;
  recordedAnswers?: RecordedAnswer[];
  checkedCriteria: string[];
  modelAnswerPlayed: boolean;
  onModelAnswerPlayed: () => void;
  onRetry: () => void;
  onComplete: () => void;
  onGoToIndex?: () => void;
  goToIndexLabel?: string;
}

export function SpeakingResults({
  task,
  questions = [],
  audioUrl,
  recordingTime,
  recordedAnswers = [],
  onModelAnswerPlayed,
  onRetry,
  onComplete,
  onGoToIndex,
  goToIndexLabel = "Another Part",
}: SpeakingResultsProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isPlayingRef = useRef(false);
  const { speak: azureSpeak, stop: azureStop, isPlaying: azureIsPlaying } = useAzureTTS();

  const isMultiQuestion = questions.length > 1;

  // Call onComplete when component mounts
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const playModelAnswerTTS = (transcriptNl: string) => {
    onModelAnswerPlayed();
    azureSpeak(transcriptNl);
  };

  const playSingleModelAnswer = () => {
    if (azureIsPlaying || isPlayingRef.current) {
      azureStop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      isPlayingRef.current = false;
      return;
    }

    onModelAnswerPlayed();

    if (task.modelAnswer.audioFile && audioRef.current) {
      audioRef.current.play();
      isPlayingRef.current = true;
    } else {
      azureSpeak(task.modelAnswer.transcriptNl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden audio element for model answer */}
      {task.modelAnswer.audioFile && (
        <audio
          ref={audioRef}
          src={task.modelAnswer.audioFile}
          onEnded={() => { isPlayingRef.current = false; }}
          onError={() => { isPlayingRef.current = false; }}
        />
      )}

      {/* Recording time / summary */}
      <div className="landing-card p-4">
        <div className="flex items-center justify-center gap-4 text-[var(--ink)]/60">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Recording: {formatTime(recordingTime)}</span>
          </div>
          {isMultiQuestion && (
            <span>
              {recordedAnswers.length + 1} questions completed
            </span>
          )}
        </div>
      </div>

      {/* Multi-question summary */}
      {isMultiQuestion ? (
        <div className="space-y-4">
          <h3 className="font-bold text-[var(--ink)]">
            Your Answers & Model Answers
          </h3>

          {questions.map((q, idx) => {
            const recorded = recordedAnswers.find((r) => r.questionIndex === idx);
            const isLast = idx === questions.length - 1;
            const qAudioUrl = isLast ? audioUrl : recorded?.audioUrl;
            const isExpanded = expandedQuestion === idx;

            return (
              <div key={q.id} className="landing-card overflow-hidden">
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-sm font-medium text-[var(--accent)]">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-[var(--ink)]">
                      {q.questionNl}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[var(--ink)]/60" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[var(--ink)]/60" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {/* User's recording for this question */}
                    {qAudioUrl && (
                      <div className="p-3 rounded-lg bg-[var(--ink)]/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="h-3 w-3 text-[var(--ink)]/60" />
                          <span className="text-xs font-medium text-[var(--ink)]/60">Your Recording</span>
                        </div>
                        <audio controls src={qAudioUrl} className="w-full" />
                      </div>
                    )}

                    {/* Model answer */}
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 text-green-700" />
                          <span className="text-xs font-medium text-green-700">Model Answer</span>
                        </div>
                        <button
                          onClick={() => playModelAnswerTTS(q.modelAnswer.transcriptNl)}
                          className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                        >
                          Listen
                        </button>
                      </div>
                      <p className="text-sm text-[var(--ink)]">
                        {q.modelAnswer.transcriptNl}
                      </p>
                      <p className="text-xs text-[var(--ink)]/60 italic mt-1">
                        {q.modelAnswer.transcript}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Single-question: Your recording vs Model answer */
        <div className="landing-card p-6">
          <h3 className="font-bold text-[var(--ink)] mb-4">
            Compare with Model Answer
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* User's recording */}
            <div className="p-4 rounded-lg bg-[var(--ink)]/5">
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="h-4 w-4 text-[var(--ink)]/60" />
                <span className="text-sm font-medium text-[var(--ink)]/60">
                  Your Recording
                </span>
              </div>
              {audioUrl && <audio controls src={audioUrl} className="w-full" />}
            </div>

            {/* Model answer */}
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="h-4 w-4 text-green-700" />
                <span className="text-sm font-medium text-green-700">
                  Model Answer
                </span>
              </div>
              <button
                onClick={playSingleModelAnswer}
                className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
              >
                Listen to Model
              </button>
            </div>
          </div>

          {/* Transcript shown by default */}
          <div className="mt-4 pt-4 border-t border-[var(--ink)]/10">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-green-700" />
                <span className="text-sm font-medium text-green-700">
                  Model Answer Text
                </span>
              </div>
              <p className="text-[var(--ink)] mb-2">
                {task.modelAnswer.transcriptNl}
              </p>
              <p className="text-sm text-[var(--ink)]/60 italic">
                {task.modelAnswer.transcript}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips section */}
      <div className="landing-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-[var(--accent)]" />
          <h3 className="font-bold text-[var(--ink)]">Tips</h3>
        </div>
        <ul className="space-y-2">
          {task.tips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-[var(--ink)]"
            >
              <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tips from Test Takers */}
      <div className="landing-card p-6 border border-[var(--blue)]/20 bg-[var(--blue-soft)]">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-[var(--blue)]" />
          <h3 className="font-bold text-[var(--ink)]">Tips from Test Takers</h3>
        </div>
        <ul className="space-y-2">
          {[
            "The exam room is loud because all candidates speak at the same time — practice with background noise.",
            "You wear headphones and speak into a microphone. Test your mic position beforehand.",
            "The computer plays the question audio only twice. Listen carefully the first time.",
            "There is a short beep before recording starts. Begin speaking immediately after.",
            "If you make a mistake, just keep going — don't restart. Fluency matters more than perfection.",
            "Practice answering within the time limit. The recording stops automatically when time runs out.",
          ].map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-[var(--ink)]"
            >
              <Check className="h-4 w-4 text-[var(--blue)] flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetry}
          className="flex-1 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Try Again
        </button>
        {onGoToIndex ? (
          <button
            onClick={onGoToIndex}
            className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
          >
            {goToIndexLabel}
          </button>
        ) : (
          <Link
            href="/learn/spreken"
            className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
          >
            {goToIndexLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
