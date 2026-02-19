"use client";

import { useState, useMemo, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mic, Clock, AlertCircle } from "lucide-react";
import { getSpeakingMockExam } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";
import { usePremium } from "@/hooks/usePremium";
import { PremiumGate } from "@/components/PremiumGate";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import type { SpeakingAttempt, SpeakingTask } from "@/lib/types";
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
  params: Promise<{ examId: string }>;
}

export default function SprekenMockExamPage({ params }: PageProps) {
  const { examId } = use(params);
  const router = useRouter();
  const { saveSpeakingAttempt } = useProgress();
  const { isPremium } = usePremium();

  const exam = useMemo(() => getSpeakingMockExam(examId), [examId]);
  const questions = exam?.questions || [];

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

    // Last question: go to results
    setStage("results");
  };

  const handleModelAnswerPlayed = () => {
    setModelAnswerPlayed(true);
  };

  const handleComplete = useCallback(() => {
    if (!exam) return;

    const attempt: SpeakingAttempt = {
      recordingDuration: recordingTime,
      selfAssessmentScore: 0,
      selfAssessmentTotal: exam.selfAssessmentCriteria.length,
      checkedCriteria: [],
      modelAnswerPlayed,
      completedAt: new Date().toISOString(),
      attemptCount,
    };

    saveSpeakingAttempt(examId, attempt);
  }, [exam, recordingTime, modelAnswerPlayed, attemptCount, saveSpeakingAttempt, examId]);

  const handleRetry = () => {
    resetRecording();
    setStage("prompt");
    setCurrentQuestionIndex(0);
    setModelAnswerPlayed(false);
    setShowTimeWarning(false);
    setRecordedAnswers([]);
  };

  if (!exam || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-[var(--ink)]">Examen niet gevonden</div>
      </div>
    );
  }

  if (!exam.isFreePreview && !isPremium) {
    return <PremiumGate backHref="/learn/spreken/select" backLabel="Back to Speaking" />;
  }

  // Construct a SpeakingTask-compatible object for SpeakingPrompt and SpeakingResults
  // SpeakingPrompt uses task.partNumber to decide rendering (Part 1 vs Parts 2-4)
  const taskCompat: SpeakingTask = {
    id: exam.id,
    partNumber: currentQuestion.partNumber || 1,
    partTitle: currentQuestion.partTitle || "",
    partTitleNl: currentQuestion.partTitleNl || "",
    title: exam.title,
    titleNl: exam.title,
    difficulty: exam.difficulty,
    questionNl: currentQuestion.questionNl,
    questionEn: currentQuestion.questionEn,
    questionParts: currentQuestion.questionParts,
    personStatement: currentQuestion.personStatement,
    personStatementNl: currentQuestion.personStatementNl,
    images: currentQuestion.images,
    recommendedDuration: currentQuestion.recommendedDuration,
    softLimitWarning: currentQuestion.softLimitWarning,
    selfAssessmentCriteria: exam.selfAssessmentCriteria,
    modelAnswer: currentQuestion.modelAnswer,
    tips: exam.tips,
    sequencingWordsRequired: currentQuestion.sequencingWordsRequired,
    isFreePreview: exam.isFreePreview,
    questions: questions,
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      {/* Header */}
      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/learn/spreken/select"
                className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-[var(--accent)]" />
                <h1 className="text-lg font-bold text-[var(--ink)]">
                  {exam.title}
                </h1>
              </div>
            </div>
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
      </header>

      {/* Prominent part + question counter */}
      {stage !== "results" && (
        <div className="bg-[var(--cream)] px-4 pt-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--ink)]/10 text-[var(--ink)]/70">
                    Deel {currentQuestion.partNumber} — {currentQuestion.partTitleNl}
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-semibold text-sm">
                    Vraag {currentQuestionIndex + 1} van {questions.length}
                  </span>
                </div>
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

          {/* Prompt stage */}
          {stage === "prompt" && (
            <div className="space-y-6">
              <SpeakingPrompt task={taskCompat} question={currentQuestion} autoPlay={stage === "prompt"} />

              {permissionStatus === "prompt" ? (
                <button
                  onClick={requestPermission}
                  className="w-full bg-[var(--ink)] hover:bg-[var(--ink)]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
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
                  className="w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
              <SpeakingPrompt task={taskCompat} question={currentQuestion} compact />
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
              <SpeakingPrompt task={taskCompat} question={currentQuestion} compact />

              <div className="landing-card p-6">
                <h3 className="font-bold text-[var(--ink)] mb-4">
                  Je opname
                </h3>
                <audio controls src={audioUrl} className="w-full mb-4" />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReRecord}
                    className="flex-1 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Opnieuw opnemen
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    {currentQuestionIndex < questions.length - 1
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
              task={taskCompat}
              questions={questions}
              audioUrl={audioUrl}
              recordingTime={recordingTime}
              recordedAnswers={recordedAnswers}
              checkedCriteria={[]}
              modelAnswerPlayed={modelAnswerPlayed}
              onModelAnswerPlayed={handleModelAnswerPlayed}
              onRetry={handleRetry}
              onComplete={handleComplete}
              onGoToIndex={() => router.push("/learn/spreken/select")}
              goToIndexLabel="Back to Exams"
            />
          )}
        </div>
      </section>
    </main>
  );
}
