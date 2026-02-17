"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export function BlogCTA() {
  const { user } = useAuth();

  return (
    <div className="my-10 rounded-2xl bg-[var(--cream-dark)] p-6 md:p-8">
      <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
        {user ? "Keep practicing" : "Ready to start practicing?"}
      </h3>
      <p className="text-[var(--ink-soft)] text-sm leading-relaxed mb-4">
        {user
          ? "Pick up where you left off with reading, listening, and KNM practice exams."
          : "Try a free practice exam — reading, listening, or KNM — and see where you stand in under 5 minutes."}
      </p>
      <Link
        href={user ? "/learn" : "/try"}
        className="cta-primary inline-block text-sm font-semibold px-6 py-3 rounded-xl"
      >
        {user ? "Continue practicing" : "Start a practice exam"}
      </Link>
    </div>
  );
}
