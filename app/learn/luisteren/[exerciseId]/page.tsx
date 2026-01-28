"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ExamHeader } from "@/components/ExamHeader";
import { ExamLayout } from "@/components/ExamLayout";
import { ExamIntroScreen } from "@/components/ExamIntroScreen";
import { ExamQuestionPanel } from "@/components/ExamQuestionPanel";
import { ContentPanel } from "@/components/ContentPanel";
import { ResultsSummary } from "@/components/ResultsSummary";
import { useProgress } from "@/hooks/useProgress";
import { getListeningExercise, shuffleArray } from "@/lib/content";
import type { ExamMode } from "@/lib/types";

export default function ListeningExercisePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const exerciseId = params.exerciseId as string;
  const mode = (searchParams.get("mode") as ExamMode) || "practice";

  const exercise = getListeningExercise(exerciseId);
  const progressKey = `luisteren-${exerciseId}`;
  const { recordAnswer, resetPassage } = useProgress();

  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const questionsOrder = useMemo(() => {
    if (!exercise) return [];
    return shuffleArray(exercise.questions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise?.id, retryKey]);

  const currentQuestion = questionsOrder[currentQuestionIndex];
  const totalQuestions = questionsOrder.length;

  const handleAnswer = (isCorrect: boolean) => {
    if (!exercise || !currentQuestion) return;
    recordAnswer(progressKey, currentQuestion.id, isCorrect, totalQuestions);
    if (isCorrect) setSessionCorrect((prev) => prev + 1);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleRetry = () => {
    resetPassage(progressKey);
    setCurrentQuestionIndex(0);
    setSessionCorrect(0);
    setIsComplete(false);
    setStarted(false);
    setRetryKey((prev) => prev + 1);
  };

  if (!exercise) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Oefening niet gevonden.</p>
      </main>
    );
  }

  if (!started) {
    return (
      <ExamIntroScreen
        title={exercise.title}
        questionCount={totalQuestions}
        mode={mode}
        onStart={() => setStarted(true)}
        showAudioTest
      />
    );
  }

  if (isComplete) {
    return (
      <ResultsSummary
        title={exercise.title}
        correctAnswers={sessionCorrect}
        totalQuestions={totalQuestions}
        onRetry={handleRetry}
        backHref="/learn/luisteren"
        backLabel="Terug naar Luisteren"
        mode={mode}
      />
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <ExamHeader
        title={exercise.title}
        backHref="/learn/luisteren"
        questionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        started={started}
      />
      <ExamLayout
        left={<ContentPanel type="luisteren" transcript={exercise.transcript} />}
        right={
          currentQuestion ? (
            <ExamQuestionPanel
              key={currentQuestion.id}
              question={currentQuestion}
              mode={mode}
              isLast={currentQuestionIndex === totalQuestions - 1}
              onAnswer={handleAnswer}
            />
          ) : null
        }
      />
    </main>
  );
}
