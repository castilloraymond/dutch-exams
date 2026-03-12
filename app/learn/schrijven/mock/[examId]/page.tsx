"use client";

import { useState, useMemo, useCallback, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getWritingMockExam } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";
import { usePremium } from "@/hooks/usePremium";
import type { FormAnswer, WritingAttempt, WritingSubmission } from "@/lib/types";
import { WritingInput } from "@/components/schrijven/WritingInput";
import { FormInput } from "@/components/schrijven/FormInput";
import { WritingResults } from "@/components/schrijven/WritingResults";
import { ExamIntroScreen } from "@/components/ExamIntroScreen";
import { useExitWarning } from "@/hooks/useExitWarning";
import { ExamHeader } from "@/components/ExamHeader";
import { ExamBottomNav } from "@/components/ExamBottomNav";
import { QuestionGrid } from "@/components/QuestionGrid";

type Stage = "writing" | "results";

interface PageProps {
  params: Promise<{ examId: string }>;
}

export default function SchrijvenMockExamPage({ params }: PageProps) {
  const { examId } = use(params);
  const router = useRouter();
  const { saveWritingAttempt } = useProgress();
  const exam = useMemo(() => getWritingMockExam(examId), [examId]);
  const { isPremium, loading: premiumLoading } = usePremium();
  const questions = exam?.questions || [];

  const [started, setStarted] = useState(false);
  const [stage, setStage] = useState<Stage>("writing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string | FormAnswer>>({});
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [showGrid, setShowGrid] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [checkedCriteria, setCheckedCriteria] = useState<string[]>([]);
  const [modelAnswerRevealed, setModelAnswerRevealed] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useExitWarning(stage === "writing");

  // Timer effect
  useEffect(() => {
    if (stage !== "writing") return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, stage]);

  // Current draft (auto-initialized to empty on first access)
  const currentDraft = currentQuestion
    ? (drafts[currentQuestion.id] ?? (currentQuestion.taskType === "form" ? {} : ""))
    : "";

  const handleDraftChange = useCallback(
    (val: string | FormAnswer) => {
      if (!currentQuestion) return;
      setDrafts((prev) => ({ ...prev, [currentQuestion.id]: val }));
    },
    [currentQuestion]
  );

  const goToQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
  }, []);

  const goPrevious = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
  }, [questions.length]);

  const toggleBookmark = useCallback((questionId: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  const submitExam = useCallback(() => {
    setStage("results");
  }, []);

  // All submissions derived from drafts
  const allSubmissions: WritingSubmission[] = useMemo(
    () =>
      questions.map((q) => ({
        questionId: q.id,
        submission: drafts[q.id] ?? (q.taskType === "form" ? {} : ""),
      })),
    [questions, drafts]
  );

  // Which questions have non-empty drafts (for the question grid)
  const answeredSet = useMemo(() => {
    const set = new Set<string>();
    for (const q of questions) {
      const draft = drafts[q.id];
      if (!draft) continue;
      if (q.taskType === "form") {
        if (Object.values(draft as FormAnswer).some((v) => (v as string)?.trim())) set.add(q.id);
      } else {
        if ((draft as string).trim().length > 0) set.add(q.id);
      }
    }
    return set;
  }, [drafts, questions]);

  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);

  const handleRevealModelAnswer = () => setModelAnswerRevealed(true);

  const handleComplete = useCallback(() => {
    if (!exam) return;
    const attempt: WritingAttempt = {
      submission: (allSubmissions[0]?.submission as string) || "",
      submissions: allSubmissions,
      selfAssessmentScore: checkedCriteria.length,
      selfAssessmentTotal: exam.selfAssessmentCriteria.length,
      checkedCriteria,
      modelAnswerRevealed,
      completedAt: new Date().toISOString(),
      timeElapsed: elapsedTime,
    };
    saveWritingAttempt(examId, attempt);
  }, [exam, allSubmissions, checkedCriteria, modelAnswerRevealed, elapsedTime, saveWritingAttempt, examId]);

  const handleRetry = () => {
    setStarted(false);
    setStage("writing");
    setCurrentQuestionIndex(0);
    setDrafts({});
    setBookmarked(new Set());
    setCheckedCriteria([]);
    setModelAnswerRevealed(false);
  };

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-[var(--ink)]">Examen niet gevonden</div>
      </div>
    );
  }

  // Premium gating
  if (!premiumLoading && !isPremium && exam && !exam.isFreePreview) {
    router.replace("/learn/schrijven/select?locked=true");
    return null;
  }

  if (!started) {
    return (
      <ExamIntroScreen
        title={exam.title}
        questionCount={exam.questionCount}
        recommendedTime={exam.recommendedTime}
        onStart={() => setStarted(true)}
        module="schrijven"
      />
    );
  }

  // Construct a WritingTask-compatible object for WritingResults
  const taskCompat = {
    ...exam,
    titleEn: exam.title,
    taskType: questions[0]?.taskType || ("free-text" as const),
    scenario: "",
    scenarioEn: "",
    prompt: "",
    promptEn: "",
    modelAnswer: questions[0]?.modelAnswer || "",
    isFreePreview: exam.isFreePreview,
  };

  if (stage === "results") {
    return (
      <WritingResults
        task={taskCompat}
        submission={allSubmissions[0]?.submission || ""}
        questions={questions}
        submissions={allSubmissions}
        checkedCriteria={checkedCriteria}
        elapsedTime={elapsedTime}
        modelAnswerRevealed={modelAnswerRevealed}
        onRevealModelAnswer={handleRevealModelAnswer}
        onRetry={handleRetry}
        onComplete={handleComplete}
        backHref="/learn/schrijven/select"
        backLabel="Back to Exams"
        isFreePreview={exam.isFreePreview}
      />
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <ExamHeader title={exam.title} startTime={startTime} />

      <section className="flex-1 container mx-auto px-4 py-6 pb-24">
        <div className="max-w-2xl mx-auto">
          {currentQuestion && (
            <div className="space-y-5">
              {/* Scenario */}
              <div className="landing-card p-4 bg-[var(--ink)]/5">
                <p className="text-[var(--ink)]">{currentQuestion.scenario}</p>
              </div>

              {/* Bullet list */}
              {currentQuestion.bullets && currentQuestion.bullets.length > 0 && (
                <ul className="space-y-1 pl-1">
                  {currentQuestion.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-2 text-[var(--ink)]">
                      <span className="mt-0.5 shrink-0">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Instruction line */}
              {currentQuestion.prompt && (
                <p className="font-semibold text-[var(--ink)] whitespace-pre-line">
                  {currentQuestion.prompt}
                </p>
              )}

              {/* Input area */}
              {currentQuestion.taskType === "form" ? (
                <FormInput
                  fields={currentQuestion.formFields || []}
                  value={currentDraft as FormAnswer}
                  onChange={handleDraftChange}
                />
              ) : (
                <WritingInput
                  value={currentDraft as string}
                  onChange={handleDraftChange}
                  placeholder="Schrijf hier je antwoord..."
                  wordRange={currentQuestion.wordRange}
                  emailTemplate={currentQuestion.emailTemplate}
                />
              )}
            </div>
          )}
        </div>
      </section>

      <ExamBottomNav
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        isBookmarked={currentQuestion ? bookmarked.has(currentQuestion.id) : false}
        onPrevious={goPrevious}
        onNext={goNext}
        onOpenGrid={() => setShowGrid(true)}
        onToggleBookmark={() => currentQuestion && toggleBookmark(currentQuestion.id)}
        onSubmit={submitExam}
      />

      {showGrid && (
        <QuestionGrid
          totalQuestions={questions.length}
          currentIndex={currentQuestionIndex}
          answeredQuestions={answeredSet}
          bookmarkedQuestions={bookmarked}
          questionIds={questionIds}
          onSelectQuestion={(index) => {
            goToQuestion(index);
            setShowGrid(false);
          }}
          onClose={() => setShowGrid(false)}
        />
      )}
    </main>
  );
}
