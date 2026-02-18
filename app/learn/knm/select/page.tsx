"use client";

import { DifficultySelector } from "@/components/DifficultySelector";
import { getMockExamIndex } from "@/lib/content";
import { usePremium } from "@/hooks/usePremium";

export default function KNMSelectPage() {
  const index = getMockExamIndex("knm");
  const { isPremium } = usePremium();

  if (!index) {
    return <div>Error loading exams</div>;
  }

  return <DifficultySelector module="knm" exams={index.exams} isPremium={isPremium} />;
}
