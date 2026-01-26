"use client";

import { useMemo } from "react";
import type { Passage, Question } from "@/lib/types";
import { getPassage, shuffleArray } from "@/lib/content";

interface UsePassageResult {
  passage: Passage | null;
  shuffledQuestions: Question[];
}

export function usePassage(passageId: string): UsePassageResult {
  const passage = useMemo(() => getPassage(passageId), [passageId]);

  const shuffledQuestions = useMemo(() => {
    if (!passage) return [];
    return shuffleArray(passage.questions);
  }, [passage]);

  return {
    passage,
    shuffledQuestions,
  };
}
