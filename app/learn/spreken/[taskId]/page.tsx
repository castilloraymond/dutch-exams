"use client";

import { useState, useMemo, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, Clock, AlertCircle } from "lucide-react";
import { getSpeakingTask } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import type { SpeakingAttempt } from "@/lib/types";
import { SpeakingPrompt } from "@/components/spreken/SpeakingPrompt";
import { AudioRecorder } from "@/components/spreken/AudioRecorder";
import { SpeakingSelfAssessment } from "@/components/spreken/SpeakingSelfAssessment";
import { SpeakingResults } from "@/components/spreken/SpeakingResults";

type Stage = "prompt" | "recording" | "playback" | "self-assessment" | "results";

interface PageProps {
  params: Promise<{ taskId: string }>;
}

export default function SprekenTaskPage({ params }: PageProps) {
  const { taskId } = use(params);
  const { saveSpeakingAttempt } = useProgress();

  const task = useMemo(() => getSpeakingTask(taskId), [taskId]);

  const [stage, setStage] = useState<Stage>("prompt");
  const [checkedCriteria, setCheckedCriteria] = useState<string[]>([]);
  const [modelAnswerPlayed, setModelAnswerPlayed] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  const {
    isRecording,
    recordingTime,
    audioBlob,
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
    if (
      isRecording &&
      task &&
      recordingTime >= task.softLimitWarning &&
      !showTimeWarning
    ) {
      setShowTimeWarning(true);
    }

    // Auto-stop at recommended duration + 10 seconds buffer
    if (isRecording && task && recordingTime >= task.recommendedDuration + 10) {
      stopRecording();
      setStage("playback");
    }
  }, [isRecording, recordingTime, task, showTimeWarning, stopRecording]);

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
    setStage("self-assessment");
  };

  const handleSelfAssessmentComplete = (criteria: string[]) => {
    setCheckedCriteria(criteria);
    setStage("results");
  };

  const handleModelAnswerPlayed = () => {
    setModelAnswerPlayed(true);
  };

  const handleComplete = () => {
    if (!task) return;

    const attempt: SpeakingAttempt = {
      recordingDuration: recordingTime,
      selfAssessmentScore: checkedCriteria.length,
      selfAssessmentTotal: task.selfAssessmentCriteria.length,
      checkedCriteria,
      modelAnswerPlayed,
      completedAt: new Date().toISOString(),
      attemptCount,
    };

    saveSpeakingAttempt(taskId, attempt);
  };

  const handleRetry = () => {
    resetRecording();
    setStage("prompt");
    setCheckedCriteria([]);
    setModelAnswerPlayed(false);
    setShowTimeWarning(false);
  };

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--landing-cream)]">
        <div className="text-[var(--landing-navy)]">Opdracht niet gevonden</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
      {/* Header */}
      <header className="border-b border-[var(--landing-navy)]/10 sticky top-0 bg-[var(--landing-cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/learn/spreken"
                className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-[var(--landing-orange)]" />
                <div>
                  <span className="text-xs text-[var(--landing-navy)]/60">
                    Deel {task.partNumber}
                  </span>
                  <h1 className="text-lg font-bold font-sans-landing text-[var(--landing-navy)]">
                    {task.partTitleNl}
                  </h1>
                </div>
              </div>
            </div>
            {(stage === "recording" || stage === "playback") && (
              <div
                className={`flex items-center gap-2 ${
                  showTimeWarning
                    ? "text-orange-500"
                    : "text-[var(--landing-navy)]/60"
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
      </header>

      {/* Time warning banner */}
      {showTimeWarning && isRecording && (
        <div className="bg-orange-100 border-b border-orange-300 px-4 py-2">
          <div className="container mx-auto flex items-center gap-2 text-orange-700 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>
              Nog {task.recommendedDuration - recordingTime} seconden! Rond je
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
              <SpeakingPrompt task={task} />

              {/* Permission request or start button */}
              {permissionStatus === "prompt" ? (
                <button
                  onClick={requestPermission}
                  className="w-full bg-[var(--landing-navy)] hover:bg-[var(--landing-navy)]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
                  className="w-full bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
              <SpeakingPrompt task={task} compact />
              <AudioRecorder
                isRecording={isRecording}
                recordingTime={recordingTime}
                onStop={handleStopRecording}
                recommendedDuration={task.recommendedDuration}
              />
            </div>
          )}

          {/* Playback stage */}
          {stage === "playback" && audioUrl && (
            <div className="space-y-6">
              <SpeakingPrompt task={task} compact />

              <div className="landing-card p-6">
                <h3 className="font-bold text-[var(--landing-navy)] mb-4">
                  Je opname
                </h3>
                <audio controls src={audioUrl} className="w-full mb-4" />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReRecord}
                    className="flex-1 border-2 border-[var(--landing-navy)] text-[var(--landing-navy)] hover:bg-[var(--landing-navy)] hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Opnieuw opnemen
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Versturen
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Self-assessment stage */}
          {stage === "self-assessment" && audioUrl && (
            <SpeakingSelfAssessment
              audioUrl={audioUrl}
              criteria={task.selfAssessmentCriteria}
              onComplete={handleSelfAssessmentComplete}
            />
          )}

          {/* Results stage */}
          {stage === "results" && (
            <SpeakingResults
              task={task}
              audioUrl={audioUrl}
              recordingTime={recordingTime}
              checkedCriteria={checkedCriteria}
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
