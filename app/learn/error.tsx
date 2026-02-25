"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function LearnError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Learn page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#ef4444]/10 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7 text-[#ef4444]" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">
            Er is iets misgegaan
          </h2>
          <p className="text-[var(--ink)]/70 text-sm">
            Er is een fout opgetreden bij het laden van de oefening.
          </p>
          <p className="text-[var(--ink)]/50 text-xs mt-1">
            Something went wrong while loading this exercise.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex-1 py-3 px-4 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent)]/90 transition-colors cursor-pointer"
          >
            Opnieuw proberen / Try again
          </button>
          <Link
            href="/learn"
            className="flex-1 py-3 px-4 rounded-lg border-2 border-[var(--ink)]/20 text-[var(--ink)] font-medium hover:border-[var(--ink)]/40 transition-colors text-center"
          >
            Terug naar modules
          </Link>
        </div>

        <p className="text-xs text-[var(--ink)]/40">
          Blijft dit probleem zich voordoen?{" "}
          <a
            href={`mailto:hello@passinburgering.com?subject=Bug%20report%3A%20${encodeURIComponent(error.message || "Learn page crash")}&body=Page%3A%20${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
            className="underline hover:text-[var(--ink)]/60"
          >
            Meld de fout / Report a bug
          </a>
        </p>
      </div>
    </div>
  );
}
