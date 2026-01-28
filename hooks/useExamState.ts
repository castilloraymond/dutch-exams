"use client";

import { useState, useCallback, useMemo } from "react";
import type { Question, AnswerRecord } from "@/lib/types";

interface UseExamStateOptions {
  questions: Question[];
  onComplete: (results: ExamResults) => void;
}

export interface ExamResults {
  correctAnswers: number;
  totalQuestions: number;
  answerRecords: AnswerRecord[];
  elapsedTime: number;
}

export function useExamState({ questions, onComplete }: UseExamStateOptions) {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime] = useState(() => Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const selectAnswer = useCallback((questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  }, []);

  const toggleBookmark = useCallback((questionId: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const goPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  }, [totalQuestions]);

  const submitExam = useCallback(() => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

    let correctCount = 0;
    const answerRecords: AnswerRecord[] = questions.map((q) => {
      const userAnswer = answers[q.id] ?? null;
      const isCorrect = userAnswer === q.correctIndex;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        questionText: q.text,
        options: q.options,
        userAnswer,
        correctAnswer: q.correctIndex,
        explanation: q.explanation,
      };
    });

    const results: ExamResults = {
      correctAnswers: correctCount,
      totalQuestions,
      answerRecords,
      elapsedTime,
    };

    onComplete(results);
    return results;
  }, [answers, questions, totalQuestions, startTime, onComplete]);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((a) => a !== null).length;
  }, [answers]);

  const isQuestionAnswered = useCallback(
    (questionId: string) => answers[questionId] !== undefined && answers[questionId] !== null,
    [answers]
  );

  const isQuestionBookmarked = useCallback(
    (questionId: string) => bookmarked.has(questionId),
    [bookmarked]
  );

  const getElapsedTime = useCallback(() => {
    return Math.floor((Date.now() - startTime) / 1000);
  }, [startTime]);

  return {
    // State
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    bookmarked,
    answeredCount,
    startTime,

    // Actions
    selectAnswer,
    toggleBookmark,
    goNext,
    goPrevious,
    goToQuestion,
    submitExam,

    // Helpers
    isQuestionAnswered,
    isQuestionBookmarked,
    getElapsedTime,
  };
}
