"use client";

import Link from "next/link";
import { ArrowLeft, Landmark, Clock, FileText } from "lucide-react";

export default function KNMPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
      <header className="border-b border-[var(--landing-navy)]/10 sticky top-0 bg-[var(--landing-cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/learn"
              className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-[var(--landing-orange)]" />
              <h1 className="text-xl font-bold font-sans-landing text-[var(--landing-navy)]">
                KNM (Kennis Nederlandse Maatschappij)
              </h1>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="landing-card p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--landing-orange)]/10 flex items-center justify-center">
              <Landmark className="h-8 w-8 text-[var(--landing-orange)]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold font-serif text-[var(--landing-navy)] mb-2">
                KNM Oefenexamen
              </h2>
              <p className="text-[var(--landing-navy)]/60">
                Test je kennis over de Nederlandse samenleving, cultuur en geschiedenis.
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-[var(--landing-navy)]/70">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>40 vragen</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>30 minuten</span>
              </div>
            </div>

            <Link href="/learn/knm/select" className="block">
              <button className="cta-primary w-full py-3 text-base">
                Kies Examenniveau
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
