"use client";

import { DifficultySelector } from "@/components/DifficultySelector";
import { getMockExamIndex } from "@/lib/content";

export default function LuisterenSelectPage() {
  const index = getMockExamIndex("luisteren");

  if (!index) {
    return <div>Error loading exams</div>;
  }

  return <DifficultySelector module="luisteren" exams={index.exams} />;
}
