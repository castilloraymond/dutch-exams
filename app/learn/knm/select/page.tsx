"use client";

import { ModuleAccordionSelector } from "@/components/ModuleAccordionSelector";
import { getMockExamIndex } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";

export default function KNMSelectPage() {
  const index = getMockExamIndex("knm");
  const { progress } = useProgress();

  if (!index) return <div>Error loading exams</div>;

  return (
    <ModuleAccordionSelector
      module="knm"
      exams={index.exams}
      examProgress={progress.examProgress ?? {}}
    />
  );
}
