"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import type { UserProgress } from "@/lib/types";
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

  const syncToCloud = useCallback(async (email: string) => {
    setProgress((prev) => {
      const updated = { ...prev, email };
      saveProgress(updated);

      // Fire and forget the API call, but await in the callback
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, progress: updated }),
      }).catch(console.error);

      return updated;
    });
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

  return {
    progress,
    isLoaded,
    recordAnswer,
    resetPassage,
    setEmail,
    syncToCloud,
    loadFromCloud,
  };
}
