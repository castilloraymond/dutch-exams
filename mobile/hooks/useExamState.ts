/**
 * useExamState hook — ported from web hooks/useExamState.ts.
 * Pure React state — no platform-specific changes needed.
 */

import { useState, useCallback, useMemo } from 'react';
import type { ExamState, AnswerRecord, Question } from '@/lib/types';

interface UseExamStateOptions {
    questions: Question[];
    onComplete?: (answers: Record<string, number | null>, timeTaken: number) => void;
}

export function useExamState({ questions, onComplete }: UseExamStateOptions) {
    const [state, setState] = useState<ExamState>({
        answers: {},
        bookmarked: new Set<string>(),
        currentQuestionIndex: 0,
        startTime: Date.now(),
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const currentQuestion = questions[state.currentQuestionIndex] || null;
    const totalQuestions = questions.length;
    const answeredCount = Object.values(state.answers).filter((a) => a !== null).length;

    const selectAnswer = useCallback((questionId: string, answerIndex: number) => {
        setState((prev) => ({
            ...prev,
            answers: { ...prev.answers, [questionId]: answerIndex },
        }));
    }, []);

    const toggleBookmark = useCallback((questionId: string) => {
        setState((prev) => {
            const newBookmarked = new Set(prev.bookmarked);
            if (newBookmarked.has(questionId)) {
                newBookmarked.delete(questionId);
            } else {
                newBookmarked.add(questionId);
            }
            return { ...prev, bookmarked: newBookmarked };
        });
    }, []);

    const nextQuestion = useCallback(() => {
        setState((prev) => ({
            ...prev,
            currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, totalQuestions - 1),
        }));
    }, [totalQuestions]);

    const previousQuestion = useCallback(() => {
        setState((prev) => ({
            ...prev,
            currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
        }));
    }, []);

    const goToQuestion = useCallback((index: number) => {
        setState((prev) => ({
            ...prev,
            currentQuestionIndex: Math.max(0, Math.min(index, totalQuestions - 1)),
        }));
    }, [totalQuestions]);

    const submit = useCallback(() => {
        const timeTaken = Math.floor((Date.now() - state.startTime) / 1000);
        setIsSubmitted(true);
        onComplete?.(state.answers, timeTaken);
    }, [state.answers, state.startTime, onComplete]);

    const answerRecords: AnswerRecord[] = useMemo(() => {
        return questions.map((q) => ({
            questionId: q.id,
            questionText: q.text,
            options: q.options,
            userAnswer: state.answers[q.id] ?? null,
            correctAnswer: q.correctIndex,
            explanation: q.explanation,
            explanationEn: q.explanationEn,
        }));
    }, [questions, state.answers]);

    const score = useMemo(() => {
        let correct = 0;
        for (const q of questions) {
            if (state.answers[q.id] === q.correctIndex) {
                correct++;
            }
        }
        return correct;
    }, [questions, state.answers]);

    const resetExam = useCallback(() => {
        setState({
            answers: {},
            bookmarked: new Set<string>(),
            currentQuestionIndex: 0,
            startTime: Date.now(),
        });
        setIsSubmitted(false);
    }, []);

    return {
        // State
        currentQuestion,
        currentQuestionIndex: state.currentQuestionIndex,
        totalQuestions,
        answeredCount,
        answers: state.answers,
        bookmarked: state.bookmarked,
        isSubmitted,
        score,
        answerRecords,
        timeTaken: Math.floor((Date.now() - state.startTime) / 1000),

        // Actions
        selectAnswer,
        toggleBookmark,
        nextQuestion,
        previousQuestion,
        goToQuestion,
        submit,
        resetExam,
    };
}
