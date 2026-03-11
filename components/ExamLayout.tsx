"use client";

import { ReactNode, useRef, useEffect } from "react";

interface ExamLayoutProps {
  left: ReactNode;
  right: ReactNode;
  bottomNav?: ReactNode;
  /** When this value changes, both panels scroll to top. Pass currentQuestionIndex. */
  scrollKey?: number;
}

export function ExamLayout({ left, right, bottomNav, scrollKey }: ExamLayoutProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollKey === undefined) return;
    leftRef.current?.scrollTo(0, 0);
    rightRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [scrollKey]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--cream)]">
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left panel - content/passage */}
        <div ref={leftRef} className="lg:w-1/2 overflow-y-auto border-b lg:border-b-0 lg:border-r border-[var(--ink)]/10 p-4 sm:p-6">
          {left}
        </div>
        {/* Right panel - question */}
        <div ref={rightRef} className="lg:w-1/2 overflow-y-auto p-4 sm:p-6">
          {right}
        </div>
      </div>
      {/* Bottom navigation */}
      {bottomNav}
    </div>
  );
}
