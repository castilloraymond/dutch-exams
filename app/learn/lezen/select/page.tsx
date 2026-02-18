"use client";

import { DifficultySelector } from "@/components/DifficultySelector";
import { getMockExamIndex } from "@/lib/content";
import { usePremium } from "@/hooks/usePremium";

export default function LezenSelectPage() {
  const index = getMockExamIndex("lezen");
  const { isPremium } = usePremium();

  if (!index) {
    return <div>Error loading exams</div>;
  }

  return <DifficultySelector module="lezen" exams={index.exams} isPremium={isPremium} />;
}
