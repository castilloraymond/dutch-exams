"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Landmark, Headphones } from "lucide-react";

const modules = [
  {
    id: "lezen",
    name: "Lezen (Reading)",
    description: "Oefen je Nederlandse leesvaardigheid met realistische teksten.",
    icon: BookOpen,
    href: "/learn/lezen",
  },
  {
    id: "knm",
    name: "KNM (Dutch Society)",
    description: "Test je kennis over Nederlandse cultuur, geschiedenis en waarden.",
    icon: Landmark,
    href: "/learn/knm",
  },
  {
    id: "luisteren",
    name: "Luisteren (Listening)",
    description: "Luister naar Nederlandse audiofragmenten en beantwoord vragen.",
    icon: Headphones,
    href: "/learn/luisteren",
  },
];

export default function LearnHubPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
      <header className="border-b border-[var(--landing-navy)]/10 sticky top-0 bg-[var(--landing-cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold font-sans-landing text-[var(--landing-navy)]">
              Oefenexamens
            </h1>
          </div>
        </div>
      </header>

      {/* Mock-up callout */}
      <div className="container mx-auto px-4 pt-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[var(--landing-orange)]/10 border border-[var(--landing-orange)]/30 rounded-lg p-4">
            <p className="text-sm text-[var(--landing-navy)]">
              <span className="font-semibold">Note:</span> This is a mock-up of the actual test. Everything you will now see is in Dutch to simulate what you will actually see when you take the test.
            </p>
          </div>
        </div>
      </div>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-serif text-[var(--landing-navy)] mb-2">
              Kies een Module
            </h2>
            <p className="text-[var(--landing-navy)]/60">
              Selecteer een module om te oefenen voor je inburgeringsexamen.
            </p>
          </div>

          <div className="space-y-4">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link key={mod.id} href={mod.href}>
                  <div className="landing-card p-4 sm:p-6 cursor-pointer mb-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--landing-orange)]/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-[var(--landing-orange)]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-[var(--landing-navy)]">
                          {mod.name}
                        </h3>
                        <p className="text-sm text-[var(--landing-navy)]/60">
                          {mod.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
