"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { QuestionView } from "@/components/QuestionView";
import { ResultsSummary } from "@/components/ResultsSummary";
import { useProgress } from "@/hooks/useProgress";
import { ArrowLeft } from "lucide-react";
import { getKNMTopic, shuffleArray } from "@/lib/content";

export default function KNMTopicPage() {
  const params = useParams();
  const topicId = params.topicId as string;

  const topic = getKNMTopic(topicId);
  const progressKey = `knm-${topicId}`;
  const { recordAnswer, resetPassage } = useProgress();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const questionsOrder = useMemo(() => {
    if (!topic) return [];
    return shuffleArray(topic.questions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic?.id, retryKey]);

  const currentQuestion = questionsOrder[currentQuestionIndex];
  const totalQuestions = questionsOrder.length;
  const progressPercent = totalQuestions > 0
    ? ((currentQuestionIndex) / totalQuestions) * 100
    : 0;

  const handleAnswer = (isCorrect: boolean) => {
    if (!topic || !currentQuestion) return;

    recordAnswer(progressKey, currentQuestion.id, isCorrect, totalQuestions);

    if (isCorrect) {
      setSessionCorrect((prev) => prev + 1);
    }

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
    setRetryKey((prev) => prev + 1);
  };

  if (!topic) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Onderwerp niet gevonden.</p>
      </main>
    );
  }

  if (isComplete) {
    return (
      <ResultsSummary
        title={topic.title}
        correctAnswers={sessionCorrect}
        totalQuestions={totalQuestions}
        onRetry={handleRetry}
        backHref="/learn/knm"
        backLabel="Terug naar KNM"
      />
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/learn/knm"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-lg font-semibold truncate">{topic.title}</h1>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Vraag {currentQuestionIndex + 1} van {totalQuestions}
            </span>
          </div>
          <Progress value={progressPercent} className="h-1 mt-3" />
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {currentQuestion && (
            <QuestionView
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={handleAnswer}
            />
          )}
        </div>
      </section>
    </main>
  );
}
