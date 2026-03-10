"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const MCQ_MODULES = ["lezen", "knm", "luisteren"];

export default function TryModulePage() {
  const params = useParams();
  const router = useRouter();
  const module = params.module as string;

  useEffect(() => {
    // Only MCQ modules get the free mock exam flow
    if (!MCQ_MODULES.includes(module)) {
      router.replace("/try");
      return;
    }

    // If user already completed a free exam, send to /try (shows signup CTA)
    if (localStorage.getItem("free-exam-completed")) {
      router.replace("/try");
      return;
    }

    // Otherwise, redirect to the mock exam
    router.replace(`/try/${module}/mock`);
  }, [module, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
      <div className="text-[var(--ink)]/60">Loading...</div>
    </main>
  );
}
