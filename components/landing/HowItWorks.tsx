"use client";

import { useRef, useState, useEffect } from "react";
import { Trophy } from "lucide-react";

export function HowItWorks() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const onScroll = () => {
            const { scrollLeft } = container;
            const cardWidth = (container.firstElementChild as HTMLElement)?.offsetWidth ?? 1;
            const gap = 24; // gap-6
            const idx = Math.round(scrollLeft / (cardWidth + gap));
            setActiveIndex(Math.min(idx, 2));
        };
        container.addEventListener("scroll", onScroll, { passive: true });
        return () => container.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <section className="py-10 sm:py-[70px] px-6 lg:px-10 bg-white reveal" id="how">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-3 sm:mb-4">
                    How it works
                </div>
                <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-4 sm:mb-5 font-extrabold">
                    Three steps to prepare
                </h2>
                <p className="text-[1.05rem] text-[var(--ink-soft)] leading-[1.7] mb-6 sm:mb-[36px]">
                    No guesswork. No wasted time. Just structured practice on the real exam format.
                </p>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:pb-0 [counter-reset:step]"
                >
                    {/* Step 1 */}
                    <div className="w-[calc(100vw-48px)] min-w-[calc(100vw-48px)] snap-start shrink-0 md:w-auto md:min-w-0 md:shrink relative [counter-increment:step] before:content-[counter(step,decimal-leading-zero)] before:text-[2.5rem] sm:before:text-[4rem] before:font-extrabold before:text-[var(--ink)]/[0.15] before:leading-none before:block before:mb-3 sm:before:mb-4 before:tracking-[-0.04em] bg-white rounded-[16px] p-6 border border-[var(--ink)]/15">
                        <h3 className="text-[1.15rem] font-bold text-[var(--ink)] mb-2.5">Pick your module</h3>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65]">
                            Choose from Lezen, Luisteren, KNM, Schrijven, or Spreken. Each targets a specific section of the inburgering exam.
                        </p>
                        <div className="mt-5 bg-[var(--cream)] rounded-[10px] p-5 border border-[#ebe8e0]">
                            <div className="flex flex-wrap gap-2">
                                {["KNM", "Reading", "Listening", "Writing", "Speaking"].map((tag, i) => (
                                    <span
                                        key={tag}
                                        className={`px-3.5 py-1.5 rounded-full text-[0.78rem] font-semibold ${
                                            i < 2
                                                ? "bg-[var(--green-soft)] text-[var(--green)]"
                                                : "bg-[var(--cream-dark)] text-[var(--ink-soft)]"
                                        }`}
                                    >
                                        {tag} {i < 2 && "✓"}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="w-[calc(100vw-48px)] min-w-[calc(100vw-48px)] snap-start shrink-0 md:w-auto md:min-w-0 md:shrink relative [counter-increment:step] before:content-[counter(step,decimal-leading-zero)] before:text-[2.5rem] sm:before:text-[4rem] before:font-extrabold before:text-[var(--ink)]/[0.15] before:leading-none before:block before:mb-3 sm:before:mb-4 before:tracking-[-0.04em] bg-white rounded-[16px] p-6 border border-[var(--ink)]/15">
                        <h3 className="text-[1.15rem] font-bold text-[var(--ink)] mb-2.5">Practice real exam questions</h3>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65]">
                            Same question format, same time pressure, same interface as the actual computer-based DUO exam. Every question includes an explanation.
                        </p>
                        <div className="mt-5 bg-[var(--cream)] rounded-[10px] p-5 border border-[#ebe8e0]">
                            <div className="text-[0.82rem] text-[var(--ink-soft)] font-semibold mb-2">Exam readiness</div>
                            <div className="h-1.5 bg-[var(--cream-dark)] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[var(--green)] to-[#4ac07a] rounded-full w-[72%]" />
                            </div>
                            <div className="text-[0.78rem] text-[var(--ink-muted)] mt-2">72% ready — ~3 weeks to go</div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="w-[calc(100vw-48px)] min-w-[calc(100vw-48px)] snap-start shrink-0 md:w-auto md:min-w-0 md:shrink relative [counter-increment:step] before:content-[counter(step,decimal-leading-zero)] before:text-[2.5rem] sm:before:text-[4rem] before:font-extrabold before:text-[var(--ink)]/[0.15] before:leading-none before:block before:mb-3 sm:before:mb-4 before:tracking-[-0.04em] bg-white rounded-[16px] p-6 border border-[var(--ink)]/15">
                        <h3 className="text-[1.15rem] font-bold text-[var(--ink)] mb-2.5">Know when you&apos;re ready</h3>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65]">
                            Track your score across sessions. When you&apos;re consistently passing, stop studying and book your exam.
                        </p>
                        <div className="mt-5 bg-[var(--cream)] rounded-[10px] p-5 border border-[#ebe8e0]">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-[0.88rem] text-[var(--ink)] font-semibold leading-[1.4]">Ready for exam day</div>
                                    <div className="text-[0.8rem] text-[var(--ink-muted)]">Consistently scoring above 80%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Dot indicators — mobile only */}
                <div className="flex justify-center gap-2 mt-4 md:hidden">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                i === activeIndex ? "bg-[var(--ink)]" : "bg-[var(--ink)]/20"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
