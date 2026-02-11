"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { AssessmentCriterion, FormAnswer, WritingTaskType } from "@/lib/types";

interface SelfAssessmentProps {
  submission: string | FormAnswer;
  taskType: WritingTaskType;
  criteria: AssessmentCriterion[];
  onComplete: (checkedCriteria: string[]) => void;
}

export function SelfAssessment({
  submission,
  taskType,
  criteria,
  onComplete,
}: SelfAssessmentProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleCriterion = (id: string) => {
    const newChecked = new Set(checked);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setChecked(newChecked);
  };

  const handleContinue = () => {
    onComplete(Array.from(checked));
  };

  const allChecked = checked.size === criteria.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--ink)] mb-2">
          Beoordeel je eigen werk
        </h2>
        <p className="text-[var(--ink)]/60">
          Lees je antwoord en vink aan wat je hebt gedaan.
        </p>
      </div>

      {/* Submission display */}
      <div className="landing-card p-4 bg-[var(--ink)]/5">
        <h3 className="text-sm font-medium text-[var(--ink)]/60 mb-2">
          Jouw antwoord:
        </h3>
        {taskType === "form" ? (
          <div className="space-y-2">
            {Object.entries(submission as FormAnswer).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="font-medium text-[var(--ink)]">{key}:</span>
                <span className="text-[var(--ink)]">{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--ink)] whitespace-pre-wrap">
            {submission as string}
          </p>
        )}
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[var(--ink)]">Checklist</h3>
          <span className="text-sm text-[var(--ink)]/60">
            {checked.size}/{criteria.length} aangevinkt
          </span>
        </div>

        {criteria.map((criterion) => (
          <button
            key={criterion.id}
            onClick={() => toggleCriterion(criterion.id)}
            className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-colors text-left ${
              checked.has(criterion.id)
                ? "border-green-500 bg-green-50"
                : "border-[var(--ink)]/20 bg-white hover:bg-[var(--ink)]/5"
            }`}
          >
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                checked.has(criterion.id)
                  ? "border-green-500 bg-green-500"
                  : "border-[var(--ink)]/30"
              }`}
            >
              {checked.has(criterion.id) && (
                <Check className="h-4 w-4 text-white" />
              )}
            </div>
            <span className="text-[var(--ink)]">{criterion.text}</span>
          </button>
        ))}
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        disabled={!allChecked}
        className="w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        {allChecked
          ? "Doorgaan"
          : `Vink alle ${criteria.length} punten aan om door te gaan`}
      </button>
    </div>
  );
}
