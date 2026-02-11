"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Landmark, Headphones, PenLine, Mic } from "lucide-react";

const modules = [
  {
    id: "lezen",
    name: "Lezen",
    description: "Oefen je Nederlandse leesvaardigheid met realistische teksten.",
    icon: BookOpen,
    href: "/learn/lezen/select",
  },
  {
    id: "knm",
    name: "KNM",
    description: "Test je kennis over Nederlandse cultuur, geschiedenis en waarden.",
    icon: Landmark,
    href: "/learn/knm/select",
  },
  {
    id: "luisteren",
    name: "Luisteren",
    description: "Luister naar Nederlandse audiofragmenten en beantwoord vragen.",
    icon: Headphones,
    href: "/learn/luisteren/select",
  },
  {
    id: "schrijven",
    name: "Schrijven",
    description: "Oefen schrijfopdrachten zoals emails, berichten en formulieren.",
    icon: PenLine,
    href: "/learn/schrijven",
  },
  {
    id: "spreken",
    name: "Spreken",
    description: "Oefen spreekvaardigheden met opnameoefeningen en feedback.",
    icon: Mic,
    href: "/learn/spreken",
  },
];

export default function LearnHubPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-[var(--ink)]">
              Oefenexamens
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">
              Kies een Module
            </h2>
            <p className="text-[var(--ink)]/60">
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
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-[var(--accent)]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-[var(--ink)]">
                          {mod.name}
                        </h3>
                        <p className="text-sm text-[var(--ink)]/60">
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
