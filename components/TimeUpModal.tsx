"use client";

import { Clock } from "lucide-react";

interface TimeUpModalProps {
  isOpen: boolean;
  onViewResults: () => void;
}

export function TimeUpModal({ isOpen, onViewResults }: TimeUpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
          <Clock className="h-7 w-7 text-[var(--accent)]" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">
            Tijd is om!
          </h2>
          <p className="text-[var(--ink)]/70 text-sm">
            De tijd voor dit examen is verstreken. Je antwoorden worden nu ingediend.
          </p>
          <p className="text-[var(--ink)]/50 text-xs mt-1">
            Time is up! Your answers will now be submitted.
          </p>
        </div>

        <button
          onClick={onViewResults}
          className="cta-primary w-full py-3 text-base cursor-pointer"
        >
          Bekijk resultaten / View Results
        </button>
      </div>
    </div>
  );
}
