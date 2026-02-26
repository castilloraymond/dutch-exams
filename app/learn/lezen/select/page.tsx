"use client";

import { LezenAccordionSelector } from "@/components/LezenAccordionSelector";
import { getMockExamIndex } from "@/lib/content";
import { usePremium } from "@/hooks/usePremium";
import { useProgress } from "@/hooks/useProgress";

export default function LezenSelectPage() {
  const index = getMockExamIndex("lezen");
  const { isPremium } = usePremium();
  const { progress } = useProgress();

  if (!index) {
    return <div>Error loading exams</div>;
  }

  const examProgress = progress.examProgress ?? {};

  return (
    <LezenAccordionSelector
      exams={index.exams}
      examProgress={examProgress}
      isPremium={isPremium}
    />
  );
}
