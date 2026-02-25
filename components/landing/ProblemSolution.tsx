"use client";

import { useRef, useState, useEffect } from "react";
import { Monitor, Layers, Zap } from "lucide-react";

export function ProblemSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const cards = [
        {
            icon: <Monitor className="h-6 w-6" />,
            iconBg: "bg-[var(--accent-soft)] text-[var(--accent)]",
            title: "Get Familiar",
            description: "Don\u2019t panic on test day because you\u2019re seeing things for the first time. Our exams look, feel, and function exactly like the real computer-based DUO tests.",
        },
        {
            icon: <Layers className="h-6 w-6" />,
            iconBg: "bg-[var(--blue-soft)] text-[var(--blue)]",
            title: "Gain Confidence",
            description: "50+ mock exams to practice on. By the time you sit for the real test, you\u2019ll be familiar with the structure, comfortable with the question format, and know what to expect across all 5 modules.",
        },
        {
            icon: <Zap className="h-6 w-6" />,
            iconBg: "bg-[var(--accent-soft)] text-[var(--accent)]",
            title: "Start Now",
            description: "No useless drills and unhelpful questions. Just log in, pick a module, and start practicing immediately.",
        },
    ];

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const onScroll = () => {
            const { scrollLeft } = container;
            const cardWidth = (container.firstElementChild as HTMLElement)?.offsetWidth ?? 1;
            const gap = 16; // gap-4
            const idx = Math.round(scrollLeft / (cardWidth + gap));
            setActiveIndex(Math.min(idx, cards.length - 1));
        };
        container.addEventListener("scroll", onScroll, { passive: true });
        return () => container.removeEventListener("scroll", onScroll);
    }, [cards.length]);

    return (
        <section className="py-10 sm:py-[70px] px-6 lg:px-10 max-w-[1200px] mx-auto reveal" id="problem">
            <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-3 sm:mb-4">
                Why us
            </div>
            <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-4 sm:mb-5 font-extrabold">
                The closest thing to the real exam
            </h2>
            <p className="text-[1.05rem] text-[var(--ink-soft)] leading-[1.7] max-w-[560px] mb-6 sm:mb-[36px]">
                Stop studying blind. Train in the exact environment you&apos;ll be tested in.
            </p>
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:mx-0 md:px-0 md:pb-0"
            >
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className="w-[calc(100vw-48px)] min-w-[calc(100vw-48px)] snap-start shrink-0 md:w-auto md:min-w-0 md:shrink bg-white rounded-[16px] p-6 sm:p-9 border border-[#ebe8e0] hover:shadow-[var(--shadow-hover)] hover:translate-y-[-4px] hover:border-transparent transition-all duration-300"
                    >
                        <div className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-5 ${card.iconBg}`}>
                            {card.icon}
                        </div>
                        <h3 className="text-[1.1rem] font-bold text-[var(--ink)] mb-2.5">{card.title}</h3>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65]">{card.description}</p>
                    </div>
                ))}
            </div>
            {/* Dot indicators — mobile only */}
            <div className="flex justify-center gap-2 mt-4 md:hidden">
                {cards.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            i === activeIndex ? "bg-[var(--ink)]" : "bg-[var(--ink)]/20"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
