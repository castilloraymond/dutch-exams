import { Clock, Shuffle, Target } from "lucide-react";

export function ProblemSection() {
    const painCards = [
        {
            icon: <Clock className="h-6 w-6" />,
            iconBg: "bg-[var(--accent-soft)] text-[var(--accent)]",
            title: "No time for classroom courses",
            description: "You work 50-hour weeks. Evening classes and rigid schedules don't fit your life. You need prep that works around your calendar, not the other way around.",
        },
        {
            icon: <Shuffle className="h-6 w-6" />,
            iconBg: "bg-[var(--blue-soft)] text-[var(--blue)]",
            title: "Scattered, outdated resources",
            description: "Free materials online are fragmented and never structured like the real exam. Without drill-style repetition on the actual format, you're studying blind.",
        },
        {
            icon: <Target className="h-6 w-6" />,
            iconBg: "bg-[#FFF8E8] text-[#B8860B]",
            title: "Unclear exam readiness",
            description: "Are you actually ready? Without constant drills, most expats walk in uncertain. That anxiety shouldn't cost you a failed attempt and €200+ in retake fees.",
        },
    ];

    return (
        <section className="py-[70px] px-6 lg:px-10 max-w-[1200px] mx-auto reveal" id="problem">
            <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-4">
                The problem
            </div>
            <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-5 font-extrabold">
                Inburgering exam prep shouldn&apos;t be<br className="hidden sm:block" /> a guessing game
            </h2>
            <p className="text-[1.05rem] text-[var(--ink-soft)] leading-[1.7] max-w-[560px] mb-[36px]">
                You moved here for a career, not to gamble on scattered study materials and hope for the best. Sound familiar?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {painCards.map((card, i) => (
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
