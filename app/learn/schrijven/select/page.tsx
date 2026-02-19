"use client";

import { DifficultySelector } from "@/components/DifficultySelector";
import { getMockExamIndex } from "@/lib/content";
import { usePremium } from "@/hooks/usePremium";

export default function SchrijvenSelectPage() {
  const index = getMockExamIndex("schrijven");
  const { isPremium } = usePremium();

  if (!index) {
    return <div>Error loading exams</div>;
  }

  return <DifficultySelector module="schrijven" exams={index.exams} isPremium={isPremium} />;
}
