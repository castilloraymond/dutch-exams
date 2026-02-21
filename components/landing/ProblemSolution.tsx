import { Clock, Shuffle, Target } from "lucide-react";

export function ProblemSection() {
    const painCards = [
        {
            icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6" />,
            iconBg: "bg-[var(--accent-soft)] text-[var(--accent)]",
            title: "No time for classroom courses",
            description: "You work full-time. Evening classes and rigid schedules don't fit. You need prep that works around your calendar.",
        },
        {
            icon: <Shuffle className="h-5 w-5 sm:h-6 sm:w-6" />,
            iconBg: "bg-[var(--blue-soft)] text-[var(--blue)]",
            title: "Scattered, outdated resources",
            description: "Free materials online are fragmented and don't match the real exam format. Without structured practice on the actual format, you're studying blind.",
        },
        {
            icon: <Target className="h-5 w-5 sm:h-6 sm:w-6" />,
            iconBg: "bg-[var(--accent-soft)] text-[var(--accent)]",
            title: "Unclear exam readiness",
            description: "Without consistent practice on the real format, you can't tell if you're ready. A failed attempt costs €200+ in retake fees.",
        },
    ];

    return (
        <section className="py-12 sm:py-[70px] px-5 sm:px-6 lg:px-10 max-w-[1200px] mx-auto reveal" id="problem">
            <div className="text-[0.78rem] sm:text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-3 sm:mb-4">
                The problem
            </div>
            <h2 className="text-[1.7rem] sm:text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-4 sm:mb-5 font-extrabold">
                Exam prep shouldn&apos;t be<br className="hidden sm:block" /> a guessing game
            </h2>
            <p className="text-[0.95rem] sm:text-[1.05rem] text-[var(--ink-soft)] leading-[1.6] sm:leading-[1.7] max-w-[560px] mb-6 sm:mb-[36px]">
                You moved here for a career, not to gamble on scattered study materials and hope for the best.
            </p>

            {/* Mobile: horizontal scroll / Desktop: grid */}
            <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none -mx-5 px-5 sm:mx-0 sm:px-0 pb-2 sm:pb-0 scrollbar-none">
                {painCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-[16px] p-6 sm:p-9 border border-[#ebe8e0] hover:shadow-[var(--shadow-hover)] hover:translate-y-[-4px] hover:border-transparent transition-all duration-300 min-w-[280px] sm:min-w-0 snap-start shrink-0 sm:shrink"
                    >
                        <div className={`w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl sm:rounded-[14px] flex items-center justify-center mb-4 sm:mb-5 ${card.iconBg}`}>
                            {card.icon}
                        </div>
                        <h3 className="text-[1rem] sm:text-[1.1rem] font-bold text-[var(--ink)] mb-2">{card.title}</h3>
                        <p className="text-[0.88rem] sm:text-[0.92rem] text-[var(--ink-soft)] leading-[1.6] sm:leading-[1.65]">{card.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
