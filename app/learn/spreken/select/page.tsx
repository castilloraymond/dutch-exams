"use client";

import { DifficultySelector } from "@/components/DifficultySelector";
import { getMockExamIndex } from "@/lib/content";
import { usePremium } from "@/hooks/usePremium";

export default function SprekenSelectPage() {
  const index = getMockExamIndex("spreken");
  const { isPremium } = usePremium();

  if (!index) {
    return <div>Error loading exams</div>;
  }

  return <DifficultySelector module="spreken" exams={index.exams} isPremium={isPremium} />;
}
