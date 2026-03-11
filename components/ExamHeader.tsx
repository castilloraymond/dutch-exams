"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

interface ExamHeaderProps {
  title: string;
  startTime: number;
  backHref?: string;
  timeLimitSeconds?: number;
  onTimeUp?: () => void;
}

export function ExamHeader({ title, startTime, backHref, timeLimitSeconds, onTimeUp }: ExamHeaderProps) {
  // Use lazy initializer to compute initial elapsed time
  const [elapsed, setElapsed] = useState(() => Math.floor((Date.now() - startTime) / 1000));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeUpCalledRef = useRef(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const newElapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(newElapsed);

      if (timeLimitSeconds && newElapsed >= timeLimitSeconds && onTimeUp && !timeUpCalledRef.current) {
        timeUpCalledRef.current = true;
        onTimeUp();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTime, timeLimitSeconds, onTimeUp]);

  // Show countdown when time limit is set, otherwise show elapsed
  const displaySeconds = timeLimitSeconds
    ? Math.max(0, timeLimitSeconds - elapsed)
    : elapsed;
  const minutes = String(Math.floor(displaySeconds / 60)).padStart(2, "0");
  const seconds = String(displaySeconds % 60).padStart(2, "0");
  const isLowTime = timeLimitSeconds ? displaySeconds <= 60 : false;

  return (
    <header className="sticky top-0 z-10 bg-[var(--ink)] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {backHref && (
            <Link href={backHref} className="shrink-0 text-white/80 hover:text-white transition-colors" aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
          <h1 className="text-base font-semibold truncate">{title}</h1>
        </div>
        <div className={`flex items-center gap-1.5 ${isLowTime ? "text-red-400 animate-pulse" : "text-white/80"}`}>
          <Clock className="h-4 w-4" />
          <span className="font-mono">{minutes}:{seconds}</span>
        </div>
      </div>
    </header>
  );
}
