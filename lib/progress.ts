import type { UserProgress, PassageProgress } from "./types";

const STORAGE_KEY = "inburgering-progress";

export function getDefaultProgress(): UserProgress {
  return {
    passageProgress: {},
  };
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") {
    return getDefaultProgress();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserProgress;
    }
  } catch (error) {
    console.error("Error loading progress:", error);
  }

  return getDefaultProgress();
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving progress:", error);
  }
}

export function getPassageProgress(
  progress: UserProgress,
  passageId: string
): PassageProgress | null {
  return progress.passageProgress[passageId] || null;
}

export function updatePassageProgress(
  progress: UserProgress,
  passageId: string,
  questionId: string,
  isCorrect: boolean,
  totalQuestions: number
): UserProgress {
  const existing = progress.passageProgress[passageId] || {
    completed: false,
    questionsAnswered: [],
    correctAnswers: 0,
    totalQuestions,
    lastAttempt: new Date().toISOString(),
  };

  const questionsAnswered = existing.questionsAnswered.includes(questionId)
    ? existing.questionsAnswered
    : [...existing.questionsAnswered, questionId];

  const correctAnswers = existing.questionsAnswered.includes(questionId)
    ? existing.correctAnswers
    : existing.correctAnswers + (isCorrect ? 1 : 0);

  const completed = questionsAnswered.length >= totalQuestions;

  return {
    ...progress,
    passageProgress: {
      ...progress.passageProgress,
      [passageId]: {
        completed,
        questionsAnswered,
        correctAnswers,
        totalQuestions,
        lastAttempt: new Date().toISOString(),
      },
    },
  };
}

export function resetPassageProgress(
  progress: UserProgress,
  passageId: string
): UserProgress {
  const newPassageProgress = { ...progress.passageProgress };
  delete newPassageProgress[passageId];

  return {
    ...progress,
    passageProgress: newPassageProgress,
  };
}

export function clearAllProgress(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing progress:", error);
  }
}
