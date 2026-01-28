"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ExamHeader } from "@/components/ExamHeader";
import { ExamLayout } from "@/components/ExamLayout";
import { ExamIntroScreen } from "@/components/ExamIntroScreen";
import { ExamQuestionPanel } from "@/components/ExamQuestionPanel";
import { ContentPanel } from "@/components/ContentPanel";
import { ResultsSummary } from "@/components/ResultsSummary";
import { usePassage } from "@/hooks/usePassage";
import { useProgress } from "@/hooks/useProgress";
import { shuffleArray } from "@/lib/content";
import type { ExamMode } from "@/lib/types";

export default function PassageExercisePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const passageId = params.passageId as string;
  const mode = (searchParams.get("mode") as ExamMode) || "practice";

  const { passage } = usePassage(passageId);
  const { recordAnswer, resetPassage } = useProgress();

  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const questionsOrder = useMemo(() => {
    if (!passage) return [];
    return shuffleArray(passage.questions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passage?.id, retryKey]);

  const currentQuestion = questionsOrder[currentQuestionIndex];
  const totalQuestions = questionsOrder.length;

  const handleAnswer = (isCorrect: boolean) => {
    if (!passage || !currentQuestion) return;
    recordAnswer(passageId, currentQuestion.id, isCorrect, totalQuestions);
    if (isCorrect) setSessionCorrect((prev) => prev + 1);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleRetry = () => {
    resetPassage(passageId);
    setCurrentQuestionIndex(0);
    setSessionCorrect(0);
    setIsComplete(false);
    setStarted(false);
    setRetryKey((prev) => prev + 1);
  };

  if (!passage) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Passage not found.</p>
      </main>
    );
  }

  if (!started) {
    return (
      <ExamIntroScreen
        title={passage.title}
        questionCount={totalQuestions}
        mode={mode}
        onStart={() => setStarted(true)}
      />
    );
  }

  if (isComplete) {
    return (
      <ResultsSummary
        title={passage.title}
        correctAnswers={sessionCorrect}
        totalQuestions={totalQuestions}
        onRetry={handleRetry}
        backHref="/learn/lezen"
        backLabel="Back to Passages"
        mode={mode}
      />
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <ExamHeader
        title={passage.title}
        backHref="/learn/lezen"
        questionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        started={started}
      />
      <ExamLayout
        left={<ContentPanel type="lezen" content={passage.content} />}
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
