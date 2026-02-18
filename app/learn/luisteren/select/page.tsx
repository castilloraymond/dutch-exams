"use client";

import { DifficultySelector } from "@/components/DifficultySelector";
import { getMockExamIndex } from "@/lib/content";
import { usePremium } from "@/hooks/usePremium";

export default function LuisterenSelectPage() {
  const index = getMockExamIndex("luisteren");
  const { isPremium } = usePremium();

  if (!index) {
    return <div>Error loading exams</div>;
  }

  return <DifficultySelector module="luisteren" exams={index.exams} isPremium={isPremium} />;
}
