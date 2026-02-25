"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Headphones, Landmark, PenLine, MessageCircle } from "lucide-react";

const modules = [
    {
        name: "Lezen",
        label: "Reading",
        icon: <BookOpen className="h-6 w-6" />,
        iconBg: "bg-[var(--blue-soft)] text-[var(--blue)]",
        description: "Read short Dutch texts — letters, notices, ads — and answer comprehension questions.",
        href: "/learn/lezen/select",
    },
    {
        name: "Luisteren",
        label: "Listening",
        icon: <Headphones className="h-6 w-6" />,
        iconBg: "bg-[var(--green-soft)] text-[var(--green)]",
        description: "Listen to Dutch conversations and answer questions about what you heard.",
        href: "/learn/luisteren/select",
    },
    {
        name: "KNM",
        label: "Dutch Society",
        icon: <Landmark className="h-6 w-6" />,
        iconBg: "bg-[var(--accent-soft)] text-[var(--accent)]",
        description: "Questions on Dutch laws, customs, healthcare, government, and daily life.",
        href: "/learn/knm/select",
    },
    {
        name: "Schrijven",
        label: "Writing",
        icon: <PenLine className="h-6 w-6" />,
        iconBg: "bg-[var(--blue-soft)] text-[var(--blue)]",
        description: "Write short emails, fill in forms, and compose messages in Dutch.",
        href: "/learn/schrijven",
    },
    {
        name: "Spreken",
        label: "Speaking",
        icon: <MessageCircle className="h-6 w-6" />,
        iconBg: "bg-[var(--green-soft)] text-[var(--green)]",
        description: "Respond to prompts and scenarios out loud in Dutch.",
        href: "/learn/spreken",
    },
];

export function ExamModules() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const onScroll = () => {
            const { scrollLeft } = container;
            const cardWidth = (container.firstElementChild as HTMLElement)?.offsetWidth ?? 1;
            const gap = 16; // gap-4
            const idx = Math.round(scrollLeft / (cardWidth + gap));
            setActiveIndex(Math.min(idx, modules.length - 1));
        };
        container.addEventListener("scroll", onScroll, { passive: true });
        return () => container.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <section className="py-10 sm:py-[70px] px-6 lg:px-10 max-w-[1200px] mx-auto reveal" id="modules">
            <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-3 sm:mb-4">
                Exam modules
            </div>
            <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-4 sm:mb-5 font-extrabold">
                What&apos;s on the exam
            </h2>
            <p className="text-[1.05rem] text-[var(--ink-soft)] leading-[1.7] max-w-[560px] mb-6 sm:mb-[36px]">
                The inburgering exam has 5 modules. We cover all of them.
            </p>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0"
            >
                {modules.map((mod) => (
                    <Link
                        key={mod.name}
                        href={mod.href}
                        className="w-[calc(100vw-48px)] min-w-[calc(100vw-48px)] snap-start shrink-0 sm:w-auto sm:min-w-0 sm:shrink bg-white rounded-[16px] p-6 sm:p-9 border border-[var(--ink)]/15 hover:shadow-[var(--shadow-hover)] hover:translate-y-[-4px] hover:border-transparent transition-all duration-300 group"
                    >
                        <div className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-5 ${mod.iconBg}`}>
                            {mod.icon}
                        </div>
                        <div className="flex items-baseline gap-2 mb-2.5">
                            <h3 className="text-[1.1rem] font-bold text-[var(--ink)]">{mod.name}</h3>
                            <span className="text-[0.82rem] text-[var(--ink-muted)]">({mod.label})</span>
                        </div>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65]">{mod.description}</p>
                    </Link>
                ))}
            </div>
            {/* Dot indicators — mobile only */}
            <div className="flex justify-center gap-2 mt-4 sm:hidden">
                {modules.map((_, i) => (
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
