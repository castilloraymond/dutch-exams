/**
 * Progress management — ported from web lib/progress.ts.
 * Uses AsyncStorage instead of localStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProgress, PassageProgress, WritingAttempt, SpeakingAttempt } from './types';

const PROGRESS_KEY = 'user_progress';

const defaultProgress: UserProgress = {
    passageProgress: {},
    examProgress: {},
    writingProgress: {},
    speakingProgress: {},
};

let cachedProgress: UserProgress | null = null;

/**
 * Load progress from AsyncStorage.
 */
export async function loadProgress(): Promise<UserProgress> {
    if (cachedProgress) return cachedProgress;

    try {
        const stored = await AsyncStorage.getItem(PROGRESS_KEY);
        if (stored) {
            cachedProgress = { ...defaultProgress, ...JSON.parse(stored) };
        } else {
            cachedProgress = { ...defaultProgress };
        }
    } catch {
        cachedProgress = { ...defaultProgress };
    }

    return cachedProgress!;
}

/**
 * Save progress to AsyncStorage.
 */
export async function saveProgress(progress: UserProgress): Promise<void> {
    cachedProgress = progress;
    try {
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
        console.error('Failed to save progress:', error);
    }
}

/**
 * Record an answer for a passage/topic/exercise.
 */
export async function recordAnswer(
    exerciseId: string,
    questionId: string,
    isCorrect: boolean,
    totalQuestions: number
): Promise<void> {
    const progress = await loadProgress();
    const existing = progress.passageProgress[exerciseId] || {
        completed: false,
        questionsAnswered: [],
        correctAnswers: 0,
        correctQuestions: [],
        totalQuestions,
        lastAttempt: new Date().toISOString(),
    };

    if (!existing.questionsAnswered.includes(questionId)) {
        existing.questionsAnswered.push(questionId);
    }

    if (isCorrect && !(existing.correctQuestions || []).includes(questionId)) {
        existing.correctAnswers++;
        existing.correctQuestions = [...(existing.correctQuestions || []), questionId];
    }

    existing.totalQuestions = totalQuestions;
    existing.lastAttempt = new Date().toISOString();
    existing.completed = existing.questionsAnswered.length >= totalQuestions;

    progress.passageProgress[exerciseId] = existing;
    await saveProgress(progress);
}

/**
 * Save an exam completion result.
 */
export async function recordExamCompletion(
    examId: string,
    correctAnswers: number,
    totalQuestions: number
): Promise<void> {
    const progress = await loadProgress();
    if (!progress.examProgress) progress.examProgress = {};

    progress.examProgress[examId] = {
        correctAnswers,
        totalQuestions,
        completedAt: new Date().toISOString(),
    };

    await saveProgress(progress);
}

/**
 * Save a writing attempt.
 */
export async function saveWritingAttempt(
    taskId: string,
    attempt: WritingAttempt
): Promise<void> {
    const progress = await loadProgress();
    if (!progress.writingProgress) progress.writingProgress = {};
    progress.writingProgress[taskId] = attempt;
    await saveProgress(progress);
}

/**
 * Save a speaking attempt.
 */
export async function saveSpeakingAttempt(
    taskId: string,
    attempt: SpeakingAttempt
): Promise<void> {
    const progress = await loadProgress();
    if (!progress.speakingProgress) progress.speakingProgress = {};
    progress.speakingProgress[taskId] = attempt;
    await saveProgress(progress);
}

/**
 * Clear all progress.
 */
export async function clearProgress(): Promise<void> {
    cachedProgress = { ...defaultProgress };
    await AsyncStorage.removeItem(PROGRESS_KEY);
}

/**
 * Get a specific passage's progress.
 */
export async function getPassageProgress(exerciseId: string): Promise<PassageProgress | null> {
    const progress = await loadProgress();
    return progress.passageProgress[exerciseId] || null;
}
