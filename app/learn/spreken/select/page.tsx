"use client";

import { ModuleAccordionSelector } from "@/components/ModuleAccordionSelector";
import { getMockExamIndex } from "@/lib/content";
import { usePremium } from "@/hooks/usePremium";
import { useProgress } from "@/hooks/useProgress";

export default function SprekenSelectPage() {
  const index = getMockExamIndex("spreken");
  const { isPremium } = usePremium();
  const { progress } = useProgress();

  if (!index) return <div>Error loading exams</div>;

  return (
    <ModuleAccordionSelector
      module="spreken"
      exams={index.exams}
      examProgress={progress.examProgress ?? {}}
      isPremium={isPremium}
    />
  );
}
