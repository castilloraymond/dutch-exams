"use client";

import Link from "next/link";

export function ModuleGrid() {
    const modules = [
        { name: "KNM (Dutch Society)", icon: "🏛️", status: "live", desc: "8 topics, 96 questions, 4 mock exams", href: "/learn/knm" },
        { name: "Lezen (Reading)", icon: "📖", status: "live", desc: "5 passages, 25 questions, 4 mock exams", href: "/learn/lezen" },
        { name: "Luisteren (Listening)", icon: "🎧", status: "live", desc: "5 exercises, 20 questions, 6 mock exams", href: "/learn/luisteren" },
        { name: "Schrijven (Writing)", icon: "✍️", status: "live", desc: "4 real-format writing tasks", href: "/learn/schrijven" },
        { name: "Spreken (Speaking)", icon: "🗣️", status: "live", desc: "4 speaking scenarios (Parts 1–4)", href: "/learn/spreken" },
    ];

    return (
        <section className="py-16 pb-8 bg-[var(--landing-cream)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--landing-navy)]">
                        All 5 Inburgering Exam Modules
                    </h2>
                    <p className="font-sans-landing text-[var(--landing-navy)]/60 mt-3">
                        Complete coverage from day one. No gaps, no surprises on test day.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {modules.map((mod, i) => {
                        const cardContent = (
                            <>
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-2xl">{mod.icon}</span>
                                    {mod.status === "live" ? (
                                        <span className="font-sans-landing text-xs bg-[var(--landing-orange)] text-white px-2 py-1 rounded font-medium">
                                            AVAILABLE
                                        </span>
                                    ) : (
                                        <span className="font-sans-landing text-xs bg-[var(--landing-navy)]/10 text-[var(--landing-navy)] px-2 py-1 rounded font-medium">
                                            COMING SOON
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-sans-landing font-semibold text-[var(--landing-navy)] mb-1">
                                    {mod.name}
                                </h3>
                                <p className="font-sans-landing text-sm text-[var(--landing-navy)]/50">
                                    {mod.desc}
                                </p>
                            </>
                        );

                        const cardClass = `landing-card rounded-xl p-5 ${mod.status === "live"
                            ? "ring-2 ring-[var(--landing-orange)] ring-offset-2"
                            : "border-2 border-dashed border-[var(--landing-navy)]/20"
                        }`;

                        return mod.status === "live" ? (
                            <Link key={i} href={mod.href} className={`${cardClass} cursor-pointer`}>
                                {cardContent}
                            </Link>
                        ) : (
                            <div key={i} className={cardClass}>
                                {cardContent}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

