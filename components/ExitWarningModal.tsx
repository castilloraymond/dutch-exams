"use client";

import { AlertTriangle } from "lucide-react";

interface ExitWarningModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ExitWarningModal({ isOpen, onCancel, onConfirm }: ExitWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center space-y-5">
        {/* Warning Icon */}
        <div className="w-14 h-14 mx-auto rounded-full bg-[var(--landing-red)]/10 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7 text-[var(--landing-red)]" />
        </div>

        {/* Content */}
        <div>
          <h2 className="text-lg font-bold font-serif text-[var(--landing-navy)] mb-2">
            Examen verlaten?
          </h2>
          <p className="text-[var(--landing-navy)]/70 text-sm">
            Weet je het zeker? Je voortgang wordt niet opgeslagen.
          </p>
          <p className="text-[var(--landing-navy)]/50 text-xs mt-1">
            Are you sure? Your progress will not be saved.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-lg border-2 border-[var(--landing-navy)]/20 text-[var(--landing-navy)] font-medium hover:border-[var(--landing-navy)]/40 transition-colors"
          >
            Annuleren / Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-lg bg-[var(--landing-red)] text-white font-medium hover:bg-[var(--landing-red)]/90 transition-colors"
          >
            Verlaten / Exit
          </button>
        </div>
      </div>
    </div>
  );
}
