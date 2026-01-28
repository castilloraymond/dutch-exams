"use client";

import { ReactNode } from "react";

interface ExamLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export function ExamLayout({ left, right }: ExamLayoutProps) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-[var(--landing-cream)]">
      <div className="lg:w-1/2 overflow-y-auto border-b lg:border-b-0 lg:border-r border-[var(--landing-navy)]/10 p-4 sm:p-6">
        {left}
      </div>
      <div className="lg:w-1/2 overflow-y-auto p-4 sm:p-6">
        {right}
      </div>
    </div>
  );
}
