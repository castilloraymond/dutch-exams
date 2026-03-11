"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PricingCard } from "@/components/landing/Pricing";

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
              Upgrade
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[600px]">
          <Suspense>
            <PricingCard compact />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
