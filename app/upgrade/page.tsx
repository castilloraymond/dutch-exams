"use client";

import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PricingCard } from "@/components/landing/Pricing";

const comparisonRows = [
  { feature: "Mock exams per module", free: "2", premium: "All 28" },
  { feature: "Writing exercises", free: "2", premium: "All 8" },
  { feature: "Speaking exercises", free: "2", premium: "All 12" },
  { feature: "Quick assessments", free: true, premium: true },
  { feature: "AI explanations", free: true, premium: true },
  { feature: "Progress tracking", free: true, premium: true },
  { feature: "Future content updates", free: false, premium: true },
  { feature: "Private feedback channel", free: false, premium: true },
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm font-medium text-[var(--ink)]">{value}</span>;
  }
  return value ? (
    <Check className="h-5 w-5 text-[var(--green)] mx-auto" />
  ) : (
    <X className="h-5 w-5 text-[var(--ink)]/20 mx-auto" />
  );
}

export default function UpgradePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/learn"
              className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-[var(--ink)]">
              Founding Member Access
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-12">
          {/* Pricing card */}
          <PricingCard compact />

          {/* Comparison table */}
          <div>
            <h3 className="text-xl font-bold text-[var(--ink)] text-center mb-6">
              Free vs Founding Member
            </h3>
            <div className="landing-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--ink)]/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--ink)]">
                      Feature
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--ink)]/60">
                      Free
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--accent)]">
                      Founding Member
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="border-b border-[var(--ink)]/5 last:border-0">
                      <td className="py-3 px-4 text-sm text-[var(--ink)]">
                        {row.feature}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <ComparisonCell value={row.free} />
                      </td>
                      <td className="py-3 px-4 text-center bg-[var(--accent)]/5">
                        <ComparisonCell value={row.premium} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <LandingFooter />
    </main>
  );
}
