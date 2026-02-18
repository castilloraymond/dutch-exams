"use client";

import { useState, useMemo, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, Clock, AlertCircle } from "lucide-react";
import { getSpeakingTask } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";
import { usePremium } from "@/hooks/usePremium";
import { PremiumGate } from "@/components/PremiumGate";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import type { SpeakingAttempt, SpeakingQuestion } from "@/lib/types";
import { SpeakingPrompt } from "@/components/spreken/SpeakingPrompt";
import { AudioRecorder } from "@/components/spreken/AudioRecorder";
import { SpeakingResults } from "@/components/spreken/SpeakingResults";
import { useExitWarning } from "@/hooks/useExitWarning";

type Stage = "prompt" | "recording" | "playback" | "results";

interface RecordedAnswer {
  questionIndex: number;
  audioUrl: string | null;
  recordingTime: number;
}

interface PageProps {
  params: Promise<{ taskId: string }>;
}

export default function SprekenTaskPage({ params }: PageProps) {
  const { taskId } = use(params);
  const { saveSpeakingAttempt } = useProgress();

  const { isPremium } = usePremium();
  const task = useMemo(() => getSpeakingTask(taskId), [taskId]);

  // Build questions array: use task.questions if available, else build single-question from legacy fields
  const questions: SpeakingQuestion[] = useMemo(() => {
    if (!task) return [];
    if (task.questions && task.questions.length > 0) return task.questions;
    // Legacy single-question fallback
    return [
      {
        id: `${task.id}-q1`,
        questionNl: task.questionNl,
        questionEn: task.questionEn,
        questionParts: task.questionParts,
        personStatement: task.personStatement,
        personStatementNl: task.personStatementNl,
        images: task.images,
        recommendedDuration: task.recommendedDuration,
        softLimitWarning: task.softLimitWarning,
        modelAnswer: task.modelAnswer,
        sequencingWordsRequired: task.sequencingWordsRequired,
      },
    ];
  }, [task]);

  const isMultiQuestion = questions.length > 1;

  const [stage, setStage] = useState<Stage>("prompt");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [modelAnswerPlayed, setModelAnswerPlayed] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [recordedAnswers, setRecordedAnswers] = useState<RecordedAnswer[]>([]);

  const currentQuestion = questions[currentQuestionIndex];

  useExitWarning(stage === "recording" || stage === "playback");

  const {
    isRecording,
    recordingTime,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    permissionStatus,
    requestPermission,
    error: recorderError,
  } = useAudioRecorder();

  // Time warning effect
  useEffect(() => {
    if (!currentQuestion) return;

    if (
      isRecording &&
      recordingTime >= currentQuestion.softLimitWarning &&
      !showTimeWarning
    ) {
      setShowTimeWarning(true);
    }

    // Auto-stop at recommended duration + 10 seconds buffer
    if (isRecording && recordingTime >= currentQuestion.recommendedDuration + 10) {
      stopRecording();
      setStage("playback");
    }
  }, [isRecording, recordingTime, currentQuestion, showTimeWarning, stopRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartRecording = async () => {
    setShowTimeWarning(false);
    await startRecording();
    setStage("recording");
    setAttemptCount((prev) => prev + 1);
  };

  const handleStopRecording = () => {
    stopRecording();
    setStage("playback");
  };

  const handleReRecord = () => {
    resetRecording();
    setShowTimeWarning(false);
    setStage("prompt");
  };

  const handleSubmit = () => {
    if (isMultiQuestion) {
      // Save this answer
      setRecordedAnswers((prev) => [
        ...prev,
        {
          questionIndex: currentQuestionIndex,
          audioUrl,
          recordingTime,
        },
      ]);

      // If more questions, advance to next
      if (currentQuestionIndex < questions.length - 1) {
        resetRecording();
        setShowTimeWarning(false);
        setCurrentQuestionIndex((prev) => prev + 1);
        setStage("prompt");
        return;
      }
    }

    // Last question or single-question mode: go to results
    setStage("results");
  };

  const handleModelAnswerPlayed = () => {
    setModelAnswerPlayed(true);
  };

  const handleComplete = useCallback(() => {
    if (!task) return;

    const attempt: SpeakingAttempt = {
      recordingDuration: recordingTime,
      selfAssessmentScore: 0,
      selfAssessmentTotal: task.selfAssessmentCriteria.length,
      checkedCriteria: [],
      modelAnswerPlayed,
      completedAt: new Date().toISOString(),
      attemptCount,
    };

    saveSpeakingAttempt(taskId, attempt);
  }, [task, recordingTime, modelAnswerPlayed, attemptCount, saveSpeakingAttempt, taskId]);

  const handleRetry = () => {
    resetRecording();
    setStage("prompt");
    setCurrentQuestionIndex(0);
    setModelAnswerPlayed(false);
    setShowTimeWarning(false);
    setRecordedAnswers([]);
  };

  if (!task || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-[var(--ink)]">Opdracht niet gevonden</div>
      </div>
    );
  }

  if (!task.isFreePreview && !isPremium) {
    return <PremiumGate backHref="/learn/spreken" backLabel="Back to Speaking" />;
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      {/* Header */}
      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/learn/spreken"
                className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-[var(--accent)]" />
                <div>
                  <span className="text-xs text-[var(--ink)]/60">
                    Deel {task.partNumber}
                  </span>
                  <h1 className="text-lg font-bold text-[var(--ink)]">
                    {task.partTitleNl}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Progress indicator for multi-question */}
              {isMultiQuestion && stage !== "results" && (
                <span className="text-sm font-medium text-[var(--ink)]/60">
                  Vraag {currentQuestionIndex + 1}/{questions.length}
                </span>
              )}
              {(stage === "recording" || stage === "playback") && (
                <div
                  className={`flex items-center gap-2 ${
                    showTimeWarning
                      ? "text-orange-500"
                      : "text-[var(--ink)]/60"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-sm">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Multi-question progress bar */}
      {isMultiQuestion && stage !== "results" && (
        <div className="bg-[var(--cream)] px-4 pt-2">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <div className="w-full h-1.5 bg-[var(--ink)]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + (stage === "playback" ? 0.5 : 0)) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time warning banner */}
      {showTimeWarning && isRecording && (
        <div className="bg-orange-100 border-b border-orange-300 px-4 py-2">
          <div className="container mx-auto flex items-center gap-2 text-orange-700 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>
              Nog {currentQuestion.recommendedDuration - recordingTime} seconden! Rond je
              antwoord af.
            </span>
          </div>
        </div>
      )}

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Permission error */}
          {recorderError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{recorderError}</p>
              {permissionStatus === "denied" && (
                <p className="text-red-600 text-xs mt-2">
                  Ga naar je browserinstellingen om microfoontoegang toe te staan.
                </p>
              )}
            </div>
          )}

          {/* Prompt stage - show task and start button */}
          {stage === "prompt" && (
            <div className="space-y-6">
              <SpeakingPrompt task={task} question={currentQuestion} autoPlay={stage === "prompt"} />

              {/* Permission request or start button */}
              {permissionStatus === "prompt" ? (
                <button
                  onClick={requestPermission}
                  className="w-full bg-[var(--ink)] hover:bg-[var(--ink)]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Microfoon toestaan
                </button>
              ) : permissionStatus === "unsupported" ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-700">
                    Je browser ondersteunt geen audio-opname. Probeer Chrome,
                    Firefox of Safari.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleStartRecording}
                  disabled={permissionStatus === "denied"}
                  className="w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Mic className="h-5 w-5" />
                  Start opname
                </button>
              )}
            </div>
          )}

          {/* Recording stage */}
          {stage === "recording" && (
            <div className="space-y-6">
              <SpeakingPrompt task={task} question={currentQuestion} compact />
              <AudioRecorder
                isRecording={isRecording}
                recordingTime={recordingTime}
                onStop={handleStopRecording}
                recommendedDuration={currentQuestion.recommendedDuration}
              />
            </div>
          )}

          {/* Playback stage */}
          {stage === "playback" && audioUrl && (
            <div className="space-y-6">
              <SpeakingPrompt task={task} question={currentQuestion} compact />

              <div className="landing-card p-6">
                <h3 className="font-bold text-[var(--ink)] mb-4">
                  Je opname
                </h3>
                <audio controls src={audioUrl} className="w-full mb-4" />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReRecord}
                    className="flex-1 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Opnieuw opnemen
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {isMultiQuestion && currentQuestionIndex < questions.length - 1
                      ? "Volgende vraag"
                      : "Versturen"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results stage */}
          {stage === "results" && (
            <SpeakingResults
              task={task}
              questions={questions}
              audioUrl={audioUrl}
              recordingTime={recordingTime}
              recordedAnswers={recordedAnswers}
              checkedCriteria={[]}
              modelAnswerPlayed={modelAnswerPlayed}
              onModelAnswerPlayed={handleModelAnswerPlayed}
              onRetry={handleRetry}
              onComplete={handleComplete}
            />
          )}
        </div>
      </section>
    </main>
  );
}
