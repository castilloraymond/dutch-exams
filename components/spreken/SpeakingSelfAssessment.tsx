"use client";

import { useState } from "react";
import { Check, Volume2 } from "lucide-react";
import type { AssessmentCriterion } from "@/lib/types";

interface SpeakingSelfAssessmentProps {
  audioUrl: string | null;
  criteria: AssessmentCriterion[];
  onComplete: (checkedCriteria: string[]) => void;
}

export function SpeakingSelfAssessment({
  audioUrl,
  criteria,
  onComplete,
}: SpeakingSelfAssessmentProps) {
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
        <h2 className="text-xl font-bold text-[var(--landing-navy)] mb-2">
          Beoordeel je eigen opname
        </h2>
        <p className="text-[var(--landing-navy)]/60">
          Luister naar je opname en vink aan wat je hebt gedaan.
        </p>
      </div>

      {/* Audio playback */}
      {audioUrl && (
        <div className="landing-card p-4 bg-[var(--landing-navy)]/5">
          <div className="flex items-center gap-3 mb-3">
            <Volume2 className="h-5 w-5 text-[var(--landing-orange)]" />
            <span className="font-medium text-[var(--landing-navy)]">
              Jouw opname
            </span>
          </div>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}

      {/* Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[var(--landing-navy)]">Checklist</h3>
          <span className="text-sm text-[var(--landing-navy)]/60">
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
                : "border-[var(--landing-navy)]/20 bg-white hover:bg-[var(--landing-navy)]/5"
            }`}
          >
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                checked.has(criterion.id)
                  ? "border-green-500 bg-green-500"
                  : "border-[var(--landing-navy)]/30"
              }`}
            >
              {checked.has(criterion.id) && (
                <Check className="h-4 w-4 text-white" />
              )}
            </div>
            <span className="text-[var(--landing-navy)]">{criterion.text}</span>
          </button>
        ))}
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        disabled={!allChecked}
        className="w-full bg-[var(--landing-orange)] hover:bg-[var(--landing-orange)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        {allChecked
          ? "Doorgaan"
          : `Vink alle ${criteria.length} punten aan om door te gaan`}
      </button>
    </div>
  );
}
