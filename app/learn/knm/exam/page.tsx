"use client";

import { useState, useMemo, useCallback } from "react";
import { ExamHeader } from "@/components/ExamHeader";
import { ExamLayout } from "@/components/ExamLayout";
import { ExamIntroScreen } from "@/components/ExamIntroScreen";
import { ExamQuestionPanel } from "@/components/ExamQuestionPanel";
import { ExamBottomNav } from "@/components/ExamBottomNav";
import { QuestionGrid } from "@/components/QuestionGrid";
import { ContentPanel } from "@/components/ContentPanel";
import { ResultsSummary } from "@/components/ResultsSummary";
import { useExamState, ExamResults } from "@/hooks/useExamState";
import { getKNMExamQuestions, shuffleArray } from "@/lib/content";
import { useExitWarning } from "@/hooks/useExitWarning";
import { useProgress } from "@/hooks/useProgress";

export default function KNMExamPage() {
  const [started, setStarted] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [results, setResults] = useState<ExamResults | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const { recordExamCompletion } = useProgress();

  // Get all questions from all topics, shuffled
  const examData = useMemo(() => {
    const allData = getKNMExamQuestions();
    return shuffleArray(allData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryKey]);

  const questions = useMemo(() => examData.map((d) => d.question), [examData]);

  const handleComplete = useCallback((examResults: ExamResults) => {
    setResults(examResults);
    recordExamCompletion("knm-free-exam", examResults.correctAnswers, examResults.totalQuestions);
  }, [recordExamCompletion]);

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

  useExitWarning(started && !results);

  const handleRetry = () => {
    setResults(null);
    setStarted(false);
    setRetryKey((prev) => prev + 1);
  };

  // Build sets for question grid
  const answeredSet = useMemo(() => {
    const set = new Set<string>();
    for (const [qId, answer] of Object.entries(answers)) {
      if (answer !== null) set.add(qId);
    }
    return set;
  }, [answers]);

  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);

  if (!started) {
    return (
      <ExamIntroScreen
        title="KNM Oefenexamen"
        questionCount={questions.length}
        recommendedTime="30 minuten"
        onStart={() => setStarted(true)}
      />
    );
  }

  if (results) {
    return (
      <ResultsSummary
        title="KNM Oefenexamen"
        correctAnswers={results.correctAnswers}
        totalQuestions={results.totalQuestions}
        elapsedTime={results.elapsedTime}
        answerRecords={results.answerRecords}
        onRetry={handleRetry}
        backHref="/learn/knm"
        backLabel="Back to KNM"
      />
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <ExamHeader title="KNM Oefenexamen" startTime={startTime} />

      <ExamLayout
        left={
          <ContentPanel
            type="knm"
            questionText={currentQuestion?.text}
          />
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
    </main>
  );
}
