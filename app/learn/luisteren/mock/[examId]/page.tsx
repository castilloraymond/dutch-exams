"use client";

import { useState, useMemo, useCallback, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ExamHeader } from "@/components/ExamHeader";
import { ExamLayout } from "@/components/ExamLayout";
import { ExamIntroScreen } from "@/components/ExamIntroScreen";
import { ExamQuestionPanel } from "@/components/ExamQuestionPanel";
import { ExamBottomNav } from "@/components/ExamBottomNav";
import { QuestionGrid } from "@/components/QuestionGrid";
import { ContentPanel } from "@/components/ContentPanel";
import { ResultsSummary } from "@/components/ResultsSummary";
import { ExitWarningModal } from "@/components/ExitWarningModal";
import { TimeUpModal } from "@/components/TimeUpModal";
import { useExamState, ExamResults } from "@/hooks/useExamState";
import { getMockExam, shuffleArray, getSuggestedExams } from "@/lib/content";
import { useUser } from "@clerk/nextjs";
import { useProgress } from "@/hooks/useProgress";
import { trackExamCompleted } from "@/lib/analytics";
import { usePremium } from "@/hooks/usePremium";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { Question } from "@/lib/types";

interface PageProps {
  params: Promise<{ examId: string }>;
}

export default function LuisterenMockExamPage({ params }: PageProps) {
  const { examId } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const { recordExamCompletion } = useProgress();
  const { isPremium, loading: premiumLoading } = usePremium();
  const [started, setStarted] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [results, setResults] = useState<ExamResults | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [timeUp, setTimeUp] = useState(false);

  const exam = useMemo(() => getMockExam(examId), [examId]);

  const timeLimitSeconds = useMemo(() => {
    if (!exam?.recommendedTime) return undefined;
    const match = exam.recommendedTime.match(/(\d+)/);
    return match ? parseInt(match[1], 10) * 60 : undefined;
  }, [exam]);

  // Build questions from transcripts
  const { questions, transcriptMap } = useMemo(() => {
    if (!exam?.transcripts) return { questions: [] as Question[], transcriptMap: new Map() };

    const allQuestions: Question[] = [];
    const map = new Map<string, typeof exam.transcripts[0]>();

    // Shuffle transcript order, but keep each transcript's questions grouped together
    const shuffledTranscripts = shuffleArray([...exam.transcripts]);
    for (const transcript of shuffledTranscripts) {
      for (const question of transcript.questions) {
        allQuestions.push(question);
        map.set(question.id, transcript);
      }
    }

    return { questions: allQuestions, transcriptMap: map };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, retryKey]);

  const handleComplete = useCallback((examResults: ExamResults) => {
    setResults(examResults);
    recordExamCompletion(examId, examResults.correctAnswers, examResults.totalQuestions);

    if (exam) {
      const pct = Math.round((examResults.correctAnswers / examResults.totalQuestions) * 100);
      trackExamCompleted({
        module: exam.module as import("@/lib/analytics").ExamModule,
        examId: exam.id,
        examType: "mock",
        correctAnswers: examResults.correctAnswers,
        totalQuestions: examResults.totalQuestions,
        percentage: pct,
        passed: pct >= 60,
        timeTakenSeconds: examResults.elapsedTime,
      });
    }

    // Save results to database if user is logged in
    if (user && exam) {
      fetch("/api/exam-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam.id,
          module: exam.module,
          difficulty: exam.difficulty,
          score: examResults.correctAnswers,
          totalQuestions: examResults.totalQuestions,
          timeTakenSeconds: examResults.elapsedTime,
          answerData: examResults.answerRecords,
        }),
      }).catch(console.error);
    }
  }, [user, exam, examId, recordExamCompletion]);

  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    bookmarked,
    startTime,
    selectAnswer,
    toggleBookmark,
    goNext,
    goPrevious,
    goToQuestion,
    submitExam,
    isQuestionBookmarked,
  } = useExamState({
    questions,
    onComplete: handleComplete,
  });

  const handleTimeUp = useCallback(() => {
    setTimeUp(true);
  }, []);

  const handleRetry = () => {
    setResults(null);
    setStarted(false);
    setTimeUp(false);
    setRetryKey((prev) => prev + 1);
  };

  const confirmExit = () => {
    router.push("/learn/luisteren/select");
  };

  // Handle browser back button
  useEffect(() => {
    if (!started || results) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [started, results]);

  // Get the current transcript for the current question
  const currentTranscript = currentQuestion ? transcriptMap.get(currentQuestion.id) : null;

  // Build sets for question grid
  const answeredSet = useMemo(() => {
    const set = new Set<string>();
    for (const [qId, answer] of Object.entries(answers)) {
      if (answer !== null) set.add(qId);
    }
    return set;
  }, [answers]);

  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-[var(--ink)]">Exam not found</div>
      </div>
    );
  }

  // Premium gating: redirect non-premium users away from locked exams
  if (!premiumLoading && !isPremium && exam && !exam.isFreePreview) {
    router.replace('/learn/luisteren/select?locked=true');
    return null;
  }

  if (!started) {
    return (
      <ExamIntroScreen
        title={exam.title}
        questionCount={exam.questionCount}
        recommendedTime={exam.recommendedTime}
        onStart={() => setStarted(true)}
        showAudioTest={true}
        module="luisteren"
      />
    );
  }

  if (results) {
    const suggestedExams = getSuggestedExams(examId);
    const allModulesCompleted = suggestedExams.length === 0;

    return (
      <ResultsSummary
        title={exam.title}
        correctAnswers={results.correctAnswers}
        totalQuestions={results.totalQuestions}
        elapsedTime={results.elapsedTime}
        answerRecords={results.answerRecords}
        onRetry={handleRetry}
        backHref="/learn/luisteren/select"
        backLabel="Back to Listening"
        suggestedExams={suggestedExams}
        allModulesCompleted={allModulesCompleted}
        isFreePreview={exam.isFreePreview}
      />
    );
  }

  return (
    <ErrorBoundary fallbackHref="/learn/luisteren/select" fallbackLabel="Back to Listening">
    <main className="min-h-screen flex flex-col">
      <ExamHeader title={exam.title} startTime={startTime} timeLimitSeconds={timeLimitSeconds} onTimeUp={handleTimeUp} />

      <ExamLayout
        scrollKey={currentQuestionIndex}
        left={
          currentTranscript && (
            <ContentPanel
              key={currentTranscript.audioFile || currentTranscript.transcript}
              type="luisteren"
              transcript={currentTranscript.transcript}
              audioFile={currentTranscript.audioFile}
              image={currentTranscript.image}
            />
          )
        }
        right={
          currentQuestion && (
            <ExamQuestionPanel
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={answers[currentQuestion.id] ?? null}
              onSelectAnswer={(idx) => selectAnswer(currentQuestion.id, idx)}
            />
          )
        }
        bottomNav={
          <ExamBottomNav
            currentIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            isBookmarked={currentQuestion ? isQuestionBookmarked(currentQuestion.id) : false}
            onPrevious={goPrevious}
            onNext={goNext}
            onOpenGrid={() => setShowGrid(true)}
            onToggleBookmark={() => currentQuestion && toggleBookmark(currentQuestion.id)}
            onSubmit={submitExam}
          />
        }
      />

      {showGrid && (
        <QuestionGrid
          totalQuestions={totalQuestions}
          currentIndex={currentQuestionIndex}
          answeredQuestions={answeredSet}
          bookmarkedQuestions={bookmarked}
          questionIds={questionIds}
          onSelectQuestion={goToQuestion}
          onClose={() => setShowGrid(false)}
        />
      )}

      <ExitWarningModal
        isOpen={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={confirmExit}
      />

      <TimeUpModal
        isOpen={timeUp && !results}
        onViewResults={submitExam}
      />
    </main>
    </ErrorBoundary>
  );
}
