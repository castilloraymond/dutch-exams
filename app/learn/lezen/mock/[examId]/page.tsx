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
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useExamState, ExamResults } from "@/hooks/useExamState";
import { getMockExam, shuffleArray, getSuggestedExams } from "@/lib/content";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import type { Question } from "@/lib/types";

interface PageProps {
  params: Promise<{ examId: string }>;
}

export default function LezenMockExamPage({ params }: PageProps) {
  const { examId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { recordExamCompletion } = useProgress();
  const [started, setStarted] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [results, setResults] = useState<ExamResults | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const exam = useMemo(() => getMockExam(examId), [examId]);

  // Build questions from passages
  const { questions, passageMap } = useMemo(() => {
    if (!exam?.passages) return { questions: [] as Question[], passageMap: new Map() };

    const allQuestions: Question[] = [];
    const map = new Map<string, typeof exam.passages[0]>();

    for (const passage of exam.passages) {
      for (const question of passage.questions) {
        allQuestions.push(question);
        map.set(question.id, passage);
      }
    }

    // Shuffle for each attempt
    return { questions: shuffleArray(allQuestions), passageMap: map };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, retryKey]);

  const handleComplete = useCallback((examResults: ExamResults) => {
    setResults(examResults);
    recordExamCompletion(examId, examResults.correctAnswers, examResults.totalQuestions);

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

  const handleRetry = () => {
    setResults(null);
    setStarted(false);
    setRetryKey((prev) => prev + 1);
  };

  const confirmExit = () => {
    router.push("/learn/lezen/select");
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

  // Get the current passage for the current question
  const currentPassage = currentQuestion ? passageMap.get(currentQuestion.id) : null;

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

  if (!started) {
    return (
      <ExamIntroScreen
        title={exam.title}
        questionCount={exam.questionCount}
        recommendedTime={exam.recommendedTime}
        onStart={() => setStarted(true)}
      />
    );
  }

  if (results) {
    // Get suggested exams (excluding current one)
    const suggestedExams = getSuggestedExams(examId);
    // For now, assume all completed if no suggestions left (simplified logic)
    const allModulesCompleted = suggestedExams.length === 0;

    return (
      <ResultsSummary
        title={exam.title}
        correctAnswers={results.correctAnswers}
        totalQuestions={results.totalQuestions}
        elapsedTime={results.elapsedTime}
        answerRecords={results.answerRecords}
        onRetry={handleRetry}
        backHref="/learn/lezen/select"
        backLabel="Back to Reading"
        suggestedExams={suggestedExams}
        allModulesCompleted={allModulesCompleted}
      />
    );
  }

  return (
    <ErrorBoundary fallbackHref="/learn/lezen/select" fallbackLabel="Back to Reading">
      <main className="min-h-screen flex flex-col">
        <ExamHeader title={exam.title} startTime={startTime} />

        <ExamLayout
          left={
            currentPassage && (
              <ContentPanel
                type="lezen"
                content={currentPassage.content}
                contentType={currentPassage.contentType}
                instruction={currentPassage.instruction}
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
      </main>
    </ErrorBoundary>
  );
}
