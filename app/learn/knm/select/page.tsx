"use client";

import { DifficultySelector } from "@/components/DifficultySelector";
import { getMockExamIndex } from "@/lib/content";

export default function KNMSelectPage() {
  const index = getMockExamIndex("knm");

  if (!index) {
    return <div>Error loading exams</div>;
  }

  return <DifficultySelector module="knm" exams={index.exams} />;
}
