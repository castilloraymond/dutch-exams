"use client";

import { useState, useMemo, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Mic, AlertCircle } from "lucide-react";
import { getSpeakingMockExam } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";
import { usePremium } from "@/hooks/usePremium";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import type { SpeakingAttempt, SpeakingTask } from "@/lib/types";
import { SpeakingPrompt } from "@/components/spreken/SpeakingPrompt";
import { AudioRecorder } from "@/components/spreken/AudioRecorder";
import { SpeakingResults } from "@/components/spreken/SpeakingResults";
import { ExamHeader } from "@/components/ExamHeader";
import { ExamBottomNav } from "@/components/ExamBottomNav";
import { QuestionGrid } from "@/components/QuestionGrid";
import { ExitWarningModal } from "@/components/ExitWarningModal";

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
  const exam = useMemo(() => getSpeakingMockExam(examId), [examId]);
  const { isPremium, loading: premiumLoading } = usePremium();
  const questions = exam?.questions || [];

  const [stage, setStage] = useState<Stage>("prompt");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [modelAnswerPlayed, setModelAnswerPlayed] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [startTime] = useState(() => Date.now());

  // Per-question recordings stored by question index
  const [recordedAnswers, setRecordedAnswers] = useState<Map<number, RecordedAnswer>>(new Map());

  const currentQuestion = questions[currentQuestionIndex];

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

  // Warn on browser close during exam (not on results)
  useEffect(() => {
    if (stage === "results") return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [stage]);

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

  // --- Navigation helpers ---

  // Save current recording to the map (if in playback with an audioUrl)
  const saveCurrentRecording = useCallback(() => {
    if (audioUrl) {
      setRecordedAnswers((prev) => {
        const next = new Map(prev);
        next.set(currentQuestionIndex, {
          questionIndex: currentQuestionIndex,
          audioUrl,
          recordingTime,
        });
        return next;
      });
    }
  }, [audioUrl, currentQuestionIndex, recordingTime]);

  const navigateToQuestion = useCallback((index: number) => {
    if (index < 0 || index >= questions.length) return;
    if (index === currentQuestionIndex) return;

    // Save current recording before navigating away
    if (stage === "playback" && audioUrl) {
      saveCurrentRecording();
    }

    resetRecording();
    setShowTimeWarning(false);
    setCurrentQuestionIndex(index);

    // If the target question has a saved recording, show playback; otherwise prompt
    setStage(recordedAnswers.has(index) ? "playback" : "prompt");
  }, [questions.length, currentQuestionIndex, stage, audioUrl, saveCurrentRecording, resetRecording, recordedAnswers]);

  const goNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length, navigateToQuestion]);

  const goPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, navigateToQuestion]);

  const toggleBookmark = useCallback(() => {
    if (!currentQuestion) return;
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  }, [currentQuestion]);

  // --- Recording handlers ---

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

  // --- Submit handler ---

  const handleSubmitExam = useCallback(() => {
    // Save current recording if in playback
    if (stage === "playback" && audioUrl) {
      saveCurrentRecording();
    }
    setStage("results");
  }, [stage, audioUrl, saveCurrentRecording]);

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
    setRecordedAnswers(new Map());
    setBookmarked(new Set());
  };

  const confirmExit = () => {
    router.push("/learn/spreken/select");
  };

  // --- Derived state for QuestionGrid ---

  const answeredSet = useMemo(() => {
    const set = new Set<string>();
    for (const [idx] of recordedAnswers) {
      const q = questions[idx];
      if (q) set.add(q.id);
    }
    // Also count current question if in playback with audio
    if (stage === "playback" && audioUrl && currentQuestion) {
      set.add(currentQuestion.id);
    }
    return set;
  }, [recordedAnswers, questions, stage, audioUrl, currentQuestion]);

  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);

  // Get the audio URL for current question: live recording or saved
  const currentAudioUrl = audioUrl || recordedAnswers.get(currentQuestionIndex)?.audioUrl || null;

  // Navigation disabled during recording
  const navDisabled = stage === "recording";

  if (!exam || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-[var(--ink)]">Examen niet gevonden</div>
      </div>
    );
  }

  // Premium gating
  if (!premiumLoading && !isPremium && exam && !exam.isFreePreview) {
    router.replace('/learn/spreken/select?locked=true');
    return null;
  }

  // Construct SpeakingTask-compatible object for SpeakingPrompt and SpeakingResults
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
    questionAudioFile: currentQuestion.questionAudioFile,
    personStatementAudioFile: currentQuestion.personStatementAudioFile,
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

  // Results stage — full screen, no nav
  if (stage === "results") {
    // Build recordedAnswers array for SpeakingResults
    const answersArray: RecordedAnswer[] = [];
    for (let i = 0; i < questions.length; i++) {
      const saved = recordedAnswers.get(i);
      if (saved) {
        answersArray.push(saved);
      }
    }

    return (
      <SpeakingResults
        task={taskCompat}
        questions={questions}
        audioUrl={currentAudioUrl}
        recordingTime={recordingTime}
        recordedAnswers={answersArray}
        checkedCriteria={[]}
        modelAnswerPlayed={modelAnswerPlayed}
        onModelAnswerPlayed={handleModelAnswerPlayed}
        onRetry={handleRetry}
        onComplete={handleComplete}
        backHref="/learn/spreken/select"
        backLabel="Back to Exams"
        isFreePreview={exam.isFreePreview}
      />
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <ExamHeader
        title={exam.title}
        startTime={startTime}
        backHref="/learn/spreken/select"
      />

      {/* Content area */}
      <div className="flex-1 bg-[var(--cream)] overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Part + question indicator */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--ink)]/10 text-[var(--ink)]/70">
              Deel {currentQuestion.partNumber} — {currentQuestion.partTitleNl}
            </span>
          </div>

          {/* Time warning banner */}
          {showTimeWarning && isRecording && (
            <div className="bg-orange-100 border border-orange-300 rounded-lg px-4 py-2 mb-4">
              <div className="flex items-center gap-2 text-orange-700 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Nog {currentQuestion.recommendedDuration - recordingTime} seconden! Rond je
                  antwoord af.
                </span>
              </div>
            </div>
          )}

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
              <SpeakingPrompt task={taskCompat} question={currentQuestion} autoPlay />

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
          {stage === "playback" && currentAudioUrl && (
            <div className="space-y-6">
              <SpeakingPrompt task={taskCompat} question={currentQuestion} compact />

              <div className="landing-card p-6">
                <h3 className="font-bold text-[var(--ink)] mb-4">
                  Je opname
                </h3>
                <audio controls src={currentAudioUrl} className="w-full mb-4" />

                <button
                  onClick={handleReRecord}
                  className="w-full border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Opnieuw opnemen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shared bottom navigation */}
      <ExamBottomNav
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        isBookmarked={currentQuestion ? bookmarked.has(currentQuestion.id) : false}
        onPrevious={navDisabled ? () => {} : goPrevious}
        onNext={navDisabled ? () => {} : goNext}
        onOpenGrid={navDisabled ? () => {} : () => setShowGrid(true)}
        onToggleBookmark={navDisabled ? () => {} : toggleBookmark}
        onSubmit={navDisabled ? () => {} : handleSubmitExam}
      />

      {/* Question grid modal */}
      {showGrid && (
        <QuestionGrid
          totalQuestions={questions.length}
          currentIndex={currentQuestionIndex}
          answeredQuestions={answeredSet}
          bookmarkedQuestions={bookmarked}
          questionIds={questionIds}
          onSelectQuestion={navigateToQuestion}
          onClose={() => setShowGrid(false)}
        />
      )}

      {/* Exit warning modal */}
      <ExitWarningModal
        isOpen={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={confirmExit}
      />
    </main>
  );
}
