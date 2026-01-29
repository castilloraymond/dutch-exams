import Link from "next/link";

export function ModuleGrid() {
    const modules = [
        { name: "Lezen (Reading)", icon: "📖", status: "live", desc: "Supermarket signs to official letters", href: "/learn/lezen/select" },
        { name: "Luisteren (Listening)", icon: "🎧", status: "live", desc: "Announcements & conversations", href: "/learn/luisteren/select" },
        { name: "KNM (Dutch Society)", icon: "🏛️", status: "live", desc: "Culture, history, values", href: "/learn/knm/select" },
        { name: "Schrijven (Writing)", icon: "✍️", status: "soon", desc: "Forms and short messages", href: "" },
        { name: "Spreken (Speaking)", icon: "🗣️", status: "soon", desc: "Everyday scenarios", href: "" },
    ];

    return (
        <section className="py-16 pb-8 bg-[var(--landing-cream)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="font-sans-landing text-sm font-medium text-[var(--landing-orange)] tracking-wide uppercase">
                        Everything you need to prepare
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--landing-navy)] mt-3">
                        Covers all the topics in the Inburgering Exam
                    </h2>
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

