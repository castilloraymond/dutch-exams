"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

interface ExamHeaderProps {
  title: string;
  backHref: string;
  questionIndex: number;
  totalQuestions: number;
  started: boolean;
}

export function ExamHeader({ title, backHref, questionIndex, totalQuestions, started }: ExamHeaderProps) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (started) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started]);

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  return (
    <header className="sticky top-0 z-10 bg-[var(--landing-navy)] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={backHref} className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-semibold truncate font-sans-landing">{title}</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-white/80">
            {questionIndex + 1} / {totalQuestions}
          </span>
          <div className="flex items-center gap-1.5 text-white/80">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{minutes}:{seconds}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
