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
        <div className="w-14 h-14 mx-auto rounded-full bg-[#ef4444]/10 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7 text-[#ef4444]" />
        </div>

        {/* Content */}
        <div>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">
            Examen verlaten?
          </h2>
          <p className="text-[var(--ink)]/70 text-sm">
            Weet je het zeker? Je voortgang wordt niet opgeslagen.
          </p>
          <p className="text-[var(--ink)]/50 text-xs mt-1">
            Are you sure? Your progress will not be saved.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-lg border-2 border-[var(--ink)]/20 text-[var(--ink)] font-medium hover:border-[var(--ink)]/40 transition-colors cursor-pointer"
          >
            Annuleren / Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-lg bg-[#ef4444] text-white font-medium hover:bg-[#ef4444]/90 transition-colors cursor-pointer"
          >
            Verlaten / Exit
          </button>
        </div>
      </div>
    </div>
  );
}
