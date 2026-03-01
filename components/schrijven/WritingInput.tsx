"use client";

import type { WritingEmailTemplate } from "@/lib/types";

interface WritingInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  wordRange?: {
    min: number;
    max: number;
  };
  disabled?: boolean;
  emailTemplate?: WritingEmailTemplate;
}

export function WritingInput({
  value,
  onChange,
  placeholder = "Schrijf hier je antwoord...",
  disabled = false,
  emailTemplate,
}: WritingInputProps) {
  if (emailTemplate) {
    return (
      <div className="border border-[var(--ink)]/20 rounded-lg overflow-hidden bg-white">
        {/* Email header */}
        <div className="border-b border-[var(--ink)]/15 bg-[var(--ink)]/3 px-4 py-2 space-y-1 text-sm">
          <div className="flex gap-2">
            <span className="text-[var(--ink)]/50 w-20 shrink-0">Aan:</span>
            <span className="text-[var(--ink)]/70">{emailTemplate.to}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[var(--ink)]/50 w-20 shrink-0">Onderwerp:</span>
            <span className="text-[var(--ink)]/70">{emailTemplate.subject}</span>
          </div>
        </div>
        {/* Email body */}
        <div className="p-4 space-y-2">
          <p className="text-[var(--ink)] text-sm">{emailTemplate.salutation}</p>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={6}
            className="w-full p-0 bg-transparent text-[var(--ink)] placeholder:text-[var(--ink)]/40 focus:outline-none resize-none disabled:cursor-not-allowed text-sm"
            style={{ fontFamily: "inherit" }}
          />
          <p className="text-[var(--ink)] text-sm">{emailTemplate.closing}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full min-h-[200px] p-4 rounded-lg border border-[var(--ink)]/20 bg-white text-[var(--ink)] placeholder:text-[var(--ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
        style={{ fontFamily: "inherit" }}
      />
      {value.trim().length < 10 && value.length > 0 && (
        <p className="text-sm text-[var(--ink)]/60">
          Schrijf minstens een paar zinnen om te versturen.
        </p>
      )}
    </div>
  );
}
