"use client";

import { DifficultySelector } from "@/components/DifficultySelector";
import { getMockExamIndex } from "@/lib/content";

export default function LezenSelectPage() {
  const index = getMockExamIndex("lezen");

  if (!index) {
    return <div>Error loading exams</div>;
  }

  return <DifficultySelector module="lezen" exams={index.exams} />;
}
