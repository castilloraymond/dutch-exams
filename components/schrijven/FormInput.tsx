"use client";

import type { FormField, FormAnswer } from "@/lib/types";

interface FormInputProps {
  fields: FormField[];
  value: FormAnswer;
  onChange: (value: FormAnswer) => void;
  disabled?: boolean;
}

export function FormInput({ fields, value, onChange, disabled = false }: FormInputProps) {
  const handleFieldChange = (fieldId: string, fieldValue: string) => {
    onChange({
      ...value,
      [fieldId]: fieldValue,
    });
  };

  return (
    <div className="landing-card p-6 space-y-4">
      <div className="border-b border-[var(--landing-navy)]/10 pb-4 mb-4">
        <h3 className="font-bold text-[var(--landing-navy)]">Inschrijfformulier</h3>
        <p className="text-sm text-[var(--landing-navy)]/60">
          Vul alle velden in met uw gegevens
        </p>
      </div>

      {fields.map((field) => (
        <div key={field.id} className="space-y-1">
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-[var(--landing-navy)]"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
            <span className="text-[var(--landing-navy)]/50 font-normal ml-2">
              ({field.labelEn})
            </span>
          </label>

          {field.type === "select" ? (
            <select
              id={field.id}
              value={value[field.id] || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={disabled}
              className="w-full p-3 rounded-lg border border-[var(--landing-navy)]/20 bg-white text-[var(--landing-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--landing-orange)]/50 focus:border-[var(--landing-orange)] disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">-- Selecteer --</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              id={field.id}
              value={value[field.id] || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={disabled}
              placeholder={field.placeholder}
              className="w-full min-h-[100px] p-3 rounded-lg border border-[var(--landing-navy)]/20 bg-white text-[var(--landing-navy)] placeholder:text-[var(--landing-navy)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--landing-orange)]/50 focus:border-[var(--landing-orange)] resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          ) : field.type === "date" ? (
            <input
              id={field.id}
              type="date"
              value={value[field.id] || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={disabled}
              className="w-full p-3 rounded-lg border border-[var(--landing-navy)]/20 bg-white text-[var(--landing-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--landing-orange)]/50 focus:border-[var(--landing-orange)] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          ) : (
            <input
              id={field.id}
              type="text"
              value={value[field.id] || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={disabled}
              placeholder={field.placeholder}
              className="w-full p-3 rounded-lg border border-[var(--landing-navy)]/20 bg-white text-[var(--landing-navy)] placeholder:text-[var(--landing-navy)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--landing-orange)]/50 focus:border-[var(--landing-orange)] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          )}
        </div>
      ))}
    </div>
  );
}
