"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle2, XCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import {
  getQuickAssessmentQuestions,
  getQuickAssessmentModules,
  type QuickAssessmentQuestion,
} from "@/lib/content";
import type { QuickAssessmentModule, QuickAssessmentAnswer, QuickAssessmentProgress } from "@/lib/types";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ExamLayout } from "@/components/ExamLayout";

const STORAGE_KEY_PREFIX = "quick-assessment-";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const module = params.module as QuickAssessmentModule;

  const [questions, setQuestions] = useState<QuickAssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuickAssessmentAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Check completed assessment
  useEffect(() => {
    const resultKey = `${STORAGE_KEY_PREFIX}${module}-result`;
    const hasCompletedResult = localStorage.getItem(resultKey);
    if (hasCompletedResult) {
      router.push("/try");
    }
  }, [module, router]);

  // Load questions and restore progress on mount
  useEffect(() => {
    const modules = getQuickAssessmentModules();
    const validModule = modules.find((m) => m.module === module);

    if (!validModule) {
      router.push("/try");
      return;
    }

    const loadedQuestions = getQuickAssessmentQuestions(module);
    if (loadedQuestions.length === 0) {
      router.push("/try");
      return;
    }

    setQuestions(loadedQuestions);

    // Try to restore progress from localStorage
    const storageKey = `${STORAGE_KEY_PREFIX}${module}-progress`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const progress: QuickAssessmentProgress = JSON.parse(saved);
        const STALE_THRESHOLD = 30 * 60 * 1000; // 30 minutes
        const isStale = !progress.lastActiveTime || Date.now() - progress.lastActiveTime > STALE_THRESHOLD;

        setCurrentIndex(progress.currentQuestionIndex);
        setAnswers(progress.answers);
        setStartTime(isStale ? Date.now() : progress.startTime);
        setQuestionStartTime(Date.now());
      } catch {
        // Invalid saved data, start fresh
        const now = Date.now();
        setStartTime(now);
        setQuestionStartTime(now);
      }
    } else {
      const now = Date.now();
      setStartTime(now);
      setQuestionStartTime(now);
    }

    setIsLoading(false);
  }, [module, router]);

  // Update elapsed time every second
  useEffect(() => {
    if (startTime === 0) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Save progress to localStorage
  const saveProgress = useCallback(
    (index: number, currentAnswers: QuickAssessmentAnswer[]) => {
      const storageKey = `${STORAGE_KEY_PREFIX}${module}-progress`;
      const progress: QuickAssessmentProgress = {
        currentQuestionIndex: index,
        answers: currentAnswers,
        startTime,
        lastActiveTime: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(progress));
    },
    [module, startTime]
  );

  const handleOptionSelect = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null || showFeedback) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    const timeSpent = Date.now() - questionStartTime;

    const answer: QuickAssessmentAnswer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedOption,
      correct: isCorrect,
      timeSpentMs: timeSpent,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setShowFeedback(true);

    // Save progress
    saveProgress(currentIndex, newAnswers);
  }, [selectedOption, showFeedback, questions, currentIndex, questionStartTime, answers, saveProgress]);

  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      // Quiz complete - save result and navigate to results
      const storageKey = `${STORAGE_KEY_PREFIX}${module}-progress`;
      localStorage.removeItem(storageKey);

      const resultKey = `${STORAGE_KEY_PREFIX}${module}-result`;
      const result = {
        module,
        answers,
        totalTimeMs: Date.now() - startTime,
        score: answers.filter((a) => a.correct).length,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(resultKey, JSON.stringify(result));

      router.push(`/try/${module}/results`);
      return;
    }

    // Move to next question
    setCurrentIndex(currentIndex + 1);
    setSelectedOption(null);
    setShowFeedback(false);
    setQuestionStartTime(Date.now());
    saveProgress(currentIndex + 1, answers);
  }, [currentIndex, questions.length, module, answers, startTime, router, saveProgress]);

  // Keyboard shortcuts for option selection and navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const question = questions[currentIndex];
      if (!question) return;

      const key = e.key.toUpperCase();

      // A, B, C, D to select options
      if (!showFeedback && ["A", "B", "C", "D"].includes(key)) {
        const optionIndex = key.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
        if (optionIndex < question.options.length) {
          setSelectedOption(optionIndex);
        }
      }

      // Enter to submit or continue
      if (e.key === "Enter") {
        if (showFeedback) {
          handleNext();
        } else if (selectedOption !== null) {
          handleSubmitAnswer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFeedback, selectedOption, questions, currentIndex, handleNext, handleSubmitAnswer]);

  if (isLoading || questions.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--landing-cream)]">
        <div className="text-[var(--landing-navy)]/60">Loading...</div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const moduleInfo = getQuickAssessmentModules().find((m) => m.module === module);

  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
      {/* Header */}
      <header className="border-b border-[var(--landing-navy)]/10 sticky top-0 bg-[var(--landing-cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/try"
                className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold font-sans-landing text-[var(--landing-navy)]">
                  {moduleInfo?.name} Assessment
                </h1>
                <p className="text-xs text-[var(--landing-navy)]/50">
                  Question {currentIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[var(--landing-navy)]/60">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-[var(--landing-navy)]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--landing-orange)] transition-all duration-300"
              style={{ width: `${((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question content - use ExamLayout for lezen (side-by-side) */}
      {module === "lezen" && currentQuestion.context?.passageContent ? (
        <ExamLayout
          left={
            <div className="landing-card p-6 bg-[var(--landing-navy)]/5 border-l-4 border-[var(--landing-orange)] h-full">
              {currentQuestion.context.passageTitle && (
                <h3 className="font-semibold text-[var(--landing-navy)] mb-3">
                  {currentQuestion.context.passageTitle}
                </h3>
              )}
              <div className="text-[var(--landing-navy)]/80 leading-relaxed whitespace-pre-line text-sm">
                {currentQuestion.context.passageContent}
              </div>
            </div>
          }
          right={
            <div className="space-y-4">
              <div className="landing-card p-6">
                <p className="text-lg text-[var(--landing-navy)] leading-relaxed">
                  {currentQuestion.text}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrect = index === currentQuestion.correctIndex;
                  const showCorrect = showFeedback && isCorrect;
                  const showWrong = showFeedback && isSelected && !isCorrect;

                  let optionClass = "landing-card p-4 cursor-pointer transition-all ";
                  if (showCorrect) {
                    optionClass += "border-2 border-[var(--landing-green)] bg-[var(--landing-green)]/5";
                  } else if (showWrong) {
                    optionClass += "border-2 border-red-500 bg-red-50";
                  } else if (isSelected && !showFeedback) {
                    optionClass += "border-2 border-[var(--landing-orange)] bg-[var(--landing-orange)]/5";
                  } else if (!showFeedback) {
                    optionClass += "hover:border-[var(--landing-orange)]/50";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={showFeedback}
                      className={`${optionClass} w-full text-left`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--landing-navy)]/5 flex items-center justify-center font-medium text-[var(--landing-navy)]/60">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1 text-[var(--landing-navy)]">{option}</span>
                        {showCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-[var(--landing-green)]" />
                        )}
                        {showWrong && <XCircle className="h-5 w-5 text-red-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback and action buttons */}
              <div className="mt-4">
                {showFeedback ? (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg ${
                        answers[answers.length - 1]?.correct
                          ? "bg-[var(--landing-green)]/10 border border-[var(--landing-green)]/30"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {answers[answers.length - 1]?.correct ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-[var(--landing-green)]" />
                            <span className="font-semibold text-[var(--landing-green)]">
                              Correct!
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span className="font-semibold text-red-600">Incorrect</span>
                          </>
                        )}
                      </div>
                      {currentQuestion.explanation && (
                        <p className="text-sm text-[var(--landing-navy)]/70">
                          {currentQuestion.explanation}
                        </p>
                      )}
                    </div>

                    {/* Learning resources tip — only on wrong answers */}
                    {!answers[answers.length - 1]?.correct && (
                      <Link
                        href="/blog/learning-resources"
                        className="flex items-start gap-3 p-3 rounded-lg bg-[var(--landing-navy)]/5 hover:bg-[var(--landing-navy)]/10 transition-colors group"
                      >
                        <BookOpen className="h-4 w-4 text-[var(--landing-orange)] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-[var(--landing-navy)]/70">
                          <span className="font-medium text-[var(--landing-navy)]">Need to study first?</span>{" "}
                          Check out our free learning resources guide{" "}
                          <span className="text-[var(--landing-orange)] group-hover:underline">&rarr;</span>
                        </p>
                      </Link>
                    )}

                    <button
                      onClick={handleNext}
                      className="w-full cta-primary py-3 text-white rounded-lg font-semibold"
                    >
                      {currentIndex >= questions.length - 1 ? "See Results" : "Next Question"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      selectedOption === null
                        ? "bg-[var(--landing-navy)]/10 text-[var(--landing-navy)]/40 cursor-not-allowed"
                        : "cta-primary text-white"
                    }`}
                  >
                    Check Answer
                  </button>
                )}
              </div>
            </div>
          }
        />
      ) : (
        /* Single column layout for luisteren and knm */
        <section className="flex-1 container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            {/* AudioPlayer for luisteren module */}
            {module === "luisteren" && (
              <div className="mb-6">
                <AudioPlayer
                  audioSrc={currentQuestion.context?.audioFile}
                  fallbackText={currentQuestion.context?.transcript}
                />
              </div>
            )}

            <div className="landing-card p-6 mb-6">
              <p className="text-lg text-[var(--landing-navy)] leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === currentQuestion.correctIndex;
                const showCorrect = showFeedback && isCorrect;
                const showWrong = showFeedback && isSelected && !isCorrect;

                let optionClass = "landing-card p-4 cursor-pointer transition-all ";
                if (showCorrect) {
                  optionClass += "border-2 border-[var(--landing-green)] bg-[var(--landing-green)]/5";
                } else if (showWrong) {
                  optionClass += "border-2 border-red-500 bg-red-50";
                } else if (isSelected && !showFeedback) {
                  optionClass += "border-2 border-[var(--landing-orange)] bg-[var(--landing-orange)]/5";
                } else if (!showFeedback) {
                  optionClass += "hover:border-[var(--landing-orange)]/50";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={showFeedback}
                    className={`${optionClass} w-full text-left`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--landing-navy)]/5 flex items-center justify-center font-medium text-[var(--landing-navy)]/60">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1 text-[var(--landing-navy)]">{option}</span>
                      {showCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-[var(--landing-green)]" />
                      )}
                      {showWrong && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback and action buttons */}
            <div className="mt-6">
              {showFeedback ? (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg ${
                      answers[answers.length - 1]?.correct
                        ? "bg-[var(--landing-green)]/10 border border-[var(--landing-green)]/30"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {answers[answers.length - 1]?.correct ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-[var(--landing-green)]" />
                          <span className="font-semibold text-[var(--landing-green)]">
                            Correct!
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="font-semibold text-red-600">Incorrect</span>
                        </>
                      )}
                    </div>
                    {currentQuestion.explanation && (
                      <p className="text-sm text-[var(--landing-navy)]/70">
                        {currentQuestion.explanation}
                      </p>
                    )}
                  </div>

                  {/* Learning resources tip — only on wrong answers */}
                  {!answers[answers.length - 1]?.correct && (
                    <Link
                      href="/blog/learning-resources"
                      className="flex items-start gap-3 p-3 rounded-lg bg-[var(--landing-navy)]/5 hover:bg-[var(--landing-navy)]/10 transition-colors group"
                    >
                      <BookOpen className="h-4 w-4 text-[var(--landing-orange)] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[var(--landing-navy)]/70">
                        <span className="font-medium text-[var(--landing-navy)]">Need to study first?</span>{" "}
                        Check out our free learning resources guide{" "}
                        <span className="text-[var(--landing-orange)] group-hover:underline">&rarr;</span>
                      </p>
                    </Link>
                  )}

                  <button
                    onClick={handleNext}
                    className="w-full cta-primary py-3 text-white rounded-lg font-semibold"
                  >
                    {currentIndex >= questions.length - 1 ? "See Results" : "Next Question"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    selectedOption === null
                      ? "bg-[var(--landing-navy)]/10 text-[var(--landing-navy)]/40 cursor-not-allowed"
                      : "cta-primary text-white"
                  }`}
                >
                  Check Answer
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
