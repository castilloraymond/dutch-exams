/**
 * useProgress hook — ported from web hooks/useProgress.ts.
 * Uses AsyncStorage instead of localStorage, with async loading.
 */

import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, WritingAttempt, SpeakingAttempt } from '@/lib/types';
import {
    loadProgress,
    saveProgress,
    recordAnswer as recordAnswerLib,
    recordExamCompletion as recordExamCompletionLib,
    saveWritingAttempt as saveWritingAttemptLib,
    saveSpeakingAttempt as saveSpeakingAttemptLib,
    clearProgress as clearProgressLib,
} from '@/lib/progress';

const defaultProgress: UserProgress = {
    passageProgress: {},
    examProgress: {},
    writingProgress: {},
    speakingProgress: {},
};

export function useProgress() {
    const [progress, setProgress] = useState<UserProgress>(defaultProgress);
    const [loading, setLoading] = useState(true);

    // Load progress on mount
    useEffect(() => {
        loadProgress().then((p) => {
            setProgress(p);
            setLoading(false);
        });
    }, []);

    const recordAnswer = useCallback(
        async (exerciseId: string, questionId: string, isCorrect: boolean, totalQuestions: number) => {
            await recordAnswerLib(exerciseId, questionId, isCorrect, totalQuestions);
            const updated = await loadProgress();
            setProgress({ ...updated });
        },
        []
    );

    const recordExamCompletion = useCallback(
        async (examId: string, correctAnswers: number, totalQuestions: number) => {
            await recordExamCompletionLib(examId, correctAnswers, totalQuestions);
            const updated = await loadProgress();
            setProgress({ ...updated });
        },
        []
    );

    const saveWritingAttemptHook = useCallback(
        async (taskId: string, attempt: WritingAttempt) => {
            await saveWritingAttemptLib(taskId, attempt);
            const updated = await loadProgress();
            setProgress({ ...updated });
        },
        []
    );

    const saveSpeakingAttemptHook = useCallback(
        async (taskId: string, attempt: SpeakingAttempt) => {
            await saveSpeakingAttemptLib(taskId, attempt);
            const updated = await loadProgress();
            setProgress({ ...updated });
        },
        []
    );

    const clearAll = useCallback(async () => {
        await clearProgressLib();
        setProgress({ ...defaultProgress });
    }, []);

    const refreshProgress = useCallback(async () => {
        const updated = await loadProgress();
        setProgress({ ...updated });
    }, []);

    return {
        progress,
        loading,
        recordAnswer,
        recordExamCompletion,
        saveWritingAttempt: saveWritingAttemptHook,
        saveSpeakingAttempt: saveSpeakingAttemptHook,
        clearProgress: clearAll,
        refreshProgress,
    };
}
