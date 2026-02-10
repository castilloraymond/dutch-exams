"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import type { UserProgress, WritingAttempt, SpeakingAttempt } from "@/lib/types";
import {
  saveProgress,
  updatePassageProgress,
  resetPassageProgress,
  getDefaultProgress,
} from "@/lib/progress";

// Use useSyncExternalStore to properly hydrate from localStorage
function useProgressStore() {
  const getSnapshot = () => {
    if (typeof window === "undefined") {
      return JSON.stringify(getDefaultProgress());
    }
    const stored = localStorage.getItem("inburgering-progress");
    return stored || JSON.stringify(getDefaultProgress());
  };

  const getServerSnapshot = () => JSON.stringify(getDefaultProgress());

  const subscribe = (callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  };

  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return JSON.parse(data) as UserProgress;
}

export function useProgress() {
  const storedProgress = useProgressStore();
  const [progress, setProgress] = useState<UserProgress>(storedProgress);
  const isLoaded = true; // Always loaded with useSyncExternalStore

  const recordAnswer = useCallback(
    (
      passageId: string,
      questionId: string,
      isCorrect: boolean,
      totalQuestions: number
    ) => {
      setProgress((prev) => {
        const updated = updatePassageProgress(
          prev,
          passageId,
          questionId,
          isCorrect,
          totalQuestions
        );
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  const resetPassage = useCallback((passageId: string) => {
    setProgress((prev) => {
      const updated = resetPassageProgress(prev, passageId);
      saveProgress(updated);
      return updated;
    });
  }, []);

  const setEmail = useCallback((email: string) => {
    setProgress((prev) => {
      const updated = { ...prev, email };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const syncToCloud = useCallback(async (email: string): Promise<boolean> => {
    let updatedProgress: UserProgress | null = null;
    setProgress((prev) => {
      const updated = { ...prev, email };
      saveProgress(updated);
      updatedProgress = updated;
      return updated;
    });

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, progress: updatedProgress }),
      });
      return true;
    } catch (error) {
      console.error("Failed to sync to cloud:", error);
      return false;
    }
  }, []);

  const loadFromCloud = useCallback(async (email: string) => {
    try {
      const response = await fetch(`/api/progress?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.progress) {
        setProgress(data.progress);
        saveProgress(data.progress);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to load from cloud:", error);
      return false;
    }
  }, []);

  // Writing progress methods
  const saveWritingAttempt = useCallback(
    (taskId: string, attempt: WritingAttempt) => {
      setProgress((prev) => {
        const updated = {
          ...prev,
          writingProgress: {
            ...prev.writingProgress,
            [taskId]: attempt,
          },
        };
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  const getWritingAttempt = useCallback(
    (taskId: string): WritingAttempt | undefined => {
      return progress.writingProgress?.[taskId];
    },
    [progress.writingProgress]
  );

  const resetWritingTask = useCallback((taskId: string) => {
    setProgress((prev) => {
      const newWritingProgress = { ...prev.writingProgress };
      delete newWritingProgress[taskId];
      const updated = {
        ...prev,
        writingProgress: newWritingProgress,
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  // Speaking progress methods
  const saveSpeakingAttempt = useCallback(
    (taskId: string, attempt: SpeakingAttempt) => {
      setProgress((prev) => {
        const updated = {
          ...prev,
          speakingProgress: {
            ...prev.speakingProgress,
            [taskId]: attempt,
          },
        };
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  const getSpeakingAttempt = useCallback(
    (taskId: string): SpeakingAttempt | undefined => {
      return progress.speakingProgress?.[taskId];
    },
    [progress.speakingProgress]
  );

  const resetSpeakingTask = useCallback((taskId: string) => {
    setProgress((prev) => {
      const newSpeakingProgress = { ...prev.speakingProgress };
      delete newSpeakingProgress[taskId];
      const updated = {
        ...prev,
        speakingProgress: newSpeakingProgress,
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  return {
    progress,
    isLoaded,
    recordAnswer,
    resetPassage,
    setEmail,
    syncToCloud,
    loadFromCloud,
    // Writing methods
    saveWritingAttempt,
    getWritingAttempt,
    resetWritingTask,
    // Speaking methods
    saveSpeakingAttempt,
    getSpeakingAttempt,
    resetSpeakingTask,
  };
}
