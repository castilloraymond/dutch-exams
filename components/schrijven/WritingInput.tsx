"use client";

interface WritingInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  wordRange?: {
    min: number;
    max: number;
  };
  disabled?: boolean;
}

export function WritingInput({
  value,
  onChange,
  placeholder = "Schrijf hier je antwoord...",
  disabled = false,
}: WritingInputProps) {
  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full min-h-[200px] p-4 rounded-lg border border-[var(--landing-navy)]/20 bg-white text-[var(--landing-navy)] placeholder:text-[var(--landing-navy)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--landing-orange)]/50 focus:border-[var(--landing-orange)] resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
        style={{ fontFamily: "inherit" }}
      />
      {value.trim().length < 10 && value.length > 0 && (
        <p className="text-sm text-[var(--landing-navy)]/60">
          Schrijf minstens een paar zinnen om te versturen.
        </p>
      )}
    </div>
  );
}
