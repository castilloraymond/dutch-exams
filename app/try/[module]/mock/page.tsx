"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExamHeader } from "@/components/ExamHeader";
import { ExamLayout } from "@/components/ExamLayout";
import { ExamIntroScreen } from "@/components/ExamIntroScreen";
import { ExamQuestionPanel } from "@/components/ExamQuestionPanel";
import { ExamBottomNav } from "@/components/ExamBottomNav";
import { QuestionGrid } from "@/components/QuestionGrid";
import { ContentPanel } from "@/components/ContentPanel";
import { ResultsSummary } from "@/components/ResultsSummary";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useExamState, ExamResults } from "@/hooks/useExamState";
import { getMockExam, shuffleArray, getFreePreviewExamId } from "@/lib/content";
import type { Question } from "@/lib/types";

const VALID_MODULES = ["lezen", "knm", "luisteren"];

export default function FreeExamPage() {
  const params = useParams();
  const router = useRouter();
  const module = params.module as string;

  const [started, setStarted] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [results, setResults] = useState<ExamResults | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Resolve the free preview exam for this module
  const examId = useMemo(() => {
    if (!VALID_MODULES.includes(module)) return null;
    return getFreePreviewExamId(module);
  }, [module]);

  const exam = useMemo(() => {
    if (!examId) return null;
    return getMockExam(examId);
  }, [examId]);

  // Build questions based on module type
  const { questions, passageMap, transcriptMap } = useMemo(() => {
    if (!exam) return { questions: [] as Question[], passageMap: new Map(), transcriptMap: new Map() };

    // Lezen: shuffle passage order, keep each passage's questions grouped
    if (module === "lezen" && exam.passages) {
      const allQuestions: Question[] = [];
      const pMap = new Map<string, NonNullable<typeof exam.passages>[0]>();
      const shuffledPassages = shuffleArray([...exam.passages]);
      for (const passage of shuffledPassages) {
        for (const question of passage.questions) {
          allQuestions.push(question);
          pMap.set(question.id, passage);
        }
      }
      return { questions: allQuestions, passageMap: pMap, transcriptMap: new Map() };
    }

    // Luisteren: shuffle transcript order, keep each transcript's questions grouped
    if (module === "luisteren" && exam.transcripts) {
      const allQuestions: Question[] = [];
      const tMap = new Map<string, NonNullable<typeof exam.transcripts>[0]>();
      const shuffledTranscripts = shuffleArray([...exam.transcripts]);
      for (const transcript of shuffledTranscripts) {
        for (const question of transcript.questions) {
          allQuestions.push(question);
          tMap.set(question.id, transcript);
        }
      }
      return { questions: allQuestions, passageMap: new Map(), transcriptMap: tMap };
    }

    // KNM: flat questions array
    if (exam.questions) {
      return { questions: shuffleArray(exam.questions), passageMap: new Map(), transcriptMap: new Map() };
    }

    return { questions: [] as Question[], passageMap: new Map(), transcriptMap: new Map() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, module, retryKey]);

  const handleComplete = useCallback((examResults: ExamResults) => {
    setResults(examResults);
    // Mark free exam as completed for gating
    localStorage.setItem("free-exam-completed", JSON.stringify({
      module,
      examId,
      completedAt: new Date().toISOString(),
    }));
  }, [module, examId]);

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

  // Redirect invalid modules
  useEffect(() => {
    if (!VALID_MODULES.includes(module) || !examId) {
      router.replace("/try");
    }
  }, [module, examId, router]);

  // Warn on navigation during exam
  useEffect(() => {
    if (!started || results) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [started, results]);

  // Current content for left panel
  const currentPassage = currentQuestion ? passageMap.get(currentQuestion.id) : null;
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
        <div className="text-[var(--ink)]">Loading...</div>
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
        showAudioTest={module === "luisteren"}
      />
    );
  }

  if (results) {
    return (
      <ResultsSummary
        title={exam.title}
        correctAnswers={results.correctAnswers}
        totalQuestions={results.totalQuestions}
        elapsedTime={results.elapsedTime}
        answerRecords={results.answerRecords}
        onRetry={handleRetry}
        backHref="/try"
        backLabel="Back to Free Exams"
        showSignupCTA
      />
    );
  }

  // Render left panel based on module type
  const leftPanel = (() => {
    if (module === "lezen" && currentPassage) {
      return (
        <ContentPanel
          type="lezen"
          content={currentPassage.content}
          contentType={currentPassage.contentType}
          instruction={currentPassage.instruction}
        />
      );
    }
    if (module === "luisteren" && currentTranscript) {
      return (
        <ContentPanel
          type="luisteren"
          transcript={currentTranscript.transcript}
          audioFile={currentTranscript.audioFile}
          image={currentTranscript.image}
        />
      );
    }
    if (module === "knm") {
      return (
        <ContentPanel
          type="knm"
          questionText={currentQuestion?.text}
          questionNumber={currentQuestionIndex + 1}
          image={currentQuestion?.image}
        />
      );
    }
    return null;
  })();

  return (
    <ErrorBoundary fallbackHref="/try" fallbackLabel="Back to Free Exams">
      <main className="min-h-screen flex flex-col">
        <ExamHeader title={exam.title} startTime={startTime} backHref="/try" />

        <ExamLayout
          scrollKey={currentQuestionIndex}
          left={leftPanel}
          right={
            currentQuestion && (
              <ExamQuestionPanel
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                selectedAnswer={answers[currentQuestion.id] ?? null}
                onSelectAnswer={(idx) => selectAnswer(currentQuestion.id, idx)}
                hideQuestionText={module === "knm"}
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
    </ErrorBoundary>
  );
}
