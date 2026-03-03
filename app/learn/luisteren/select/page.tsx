"use client";

import { ModuleAccordionSelector } from "@/components/ModuleAccordionSelector";
import { getMockExamIndex } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";

export default function LuisterenSelectPage() {
  const index = getMockExamIndex("luisteren");
  const { progress } = useProgress();

  if (!index) return <div>Error loading exams</div>;

  return (
    <ModuleAccordionSelector
      module="luisteren"
      exams={index.exams}
      examProgress={progress.examProgress ?? {}}
    />
  );
}
