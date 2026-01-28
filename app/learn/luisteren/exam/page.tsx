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
import { getLuisterenExamQuestions, shuffleArray } from "@/lib/content";

export default function LuisterenExamPage() {
  const [started, setStarted] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [results, setResults] = useState<ExamResults | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Get all questions from all exercises, shuffled
  const examData = useMemo(() => {
    const allData = getLuisterenExamQuestions();
    return shuffleArray(allData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryKey]);

  const questions = useMemo(() => examData.map((d) => d.question), [examData]);

  const handleComplete = useCallback((examResults: ExamResults) => {
    setResults(examResults);
  }, []);

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

  // Get the current exercise for the current question
  const currentExercise = examData[currentQuestionIndex]?.exercise;

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
        title="Luisteren A2 Oefenexamen"
        questionCount={questions.length}
        recommendedTime="45 minuten"
        onStart={() => setStarted(true)}
        showAudioTest
      />
    );
  }

  if (results) {
    return (
      <ResultsSummary
        title="Luisteren A2 Oefenexamen"
        correctAnswers={results.correctAnswers}
        totalQuestions={results.totalQuestions}
        elapsedTime={results.elapsedTime}
        answerRecords={results.answerRecords}
        onRetry={handleRetry}
        backHref="/learn/luisteren"
        backLabel="Terug naar Luisteren"
      />
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <ExamHeader title="Luisteren A2 Oefenexamen" startTime={startTime} />

      <ExamLayout
        left={
          currentExercise && (
            <ContentPanel
              type="luisteren"
              transcript={currentExercise.transcript}
              audioFile={currentExercise.audioFile}
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
    </main>
  );
}
