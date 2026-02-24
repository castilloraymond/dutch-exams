import { Monitor, Layers, Zap } from "lucide-react";

export function ProblemSection() {
    const cards = [
        {
            icon: <Monitor className="h-6 w-6" />,
            iconBg: "bg-[var(--accent-soft)] text-[var(--accent)]",
            title: "The Exact Format",
            description: "Don\u2019t lose points because you\u2019re fumbling with a new interface on test day. Our exams look, feel, and function exactly like the real computer-based DUO tests.",
        },
        {
            icon: <Layers className="h-6 w-6" />,
            iconBg: "bg-[var(--blue-soft)] text-[var(--blue)]",
            title: "Large Quantity",
            description: "50+ mock exams to practice on. By the time you sit for the real test, you\u2019ll be familiar with the structure, comfortable with the question format, and know what to expect across all 5 modules.",
        },
        {
            icon: <Zap className="h-6 w-6" />,
            iconBg: "bg-[var(--accent-soft)] text-[var(--accent)]",
            title: "Zero Friction",
            description: "No useless drills and unhelpful questions. Just log in, pick a module, and start practicing immediately.",
        },
    ];

    return (
        <section className="py-[70px] px-6 lg:px-10 max-w-[1200px] mx-auto reveal" id="problem">
            <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-4">
                Why us
            </div>
            <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-5 font-extrabold">
                The closest thing to the real exam
            </h2>
            <p className="text-[1.05rem] text-[var(--ink-soft)] leading-[1.7] max-w-[560px] mb-[36px]">
                Stop studying blind. Train in the exact environment you&apos;ll be tested in.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-[16px] p-9 border border-[#ebe8e0] hover:shadow-[var(--shadow-hover)] hover:translate-y-[-4px] hover:border-transparent transition-all duration-300"
                    >
                        <div className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-5 ${card.iconBg}`}>
                            {card.icon}
                        </div>
                        <h3 className="text-[1.1rem] font-bold text-[var(--ink)] mb-2.5">{card.title}</h3>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65]">{card.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
