"use client";

import Link from "next/link";
import { ArrowRight, Check, Clock, CircleCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function LandingHero() {
    const { user } = useAuth();

    return (
        <section className="pt-[120px] pb-[70px] px-6 lg:px-10 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
            {/* Left column */}
            <div className="animate-reveal">
                <div className="inline-flex items-center gap-2 bg-[var(--accent-soft)] text-[var(--accent)] font-semibold text-[0.82rem] px-4 py-2 rounded-full mb-7 tracking-[0.02em]">
                    ✨ Free during beta — no payment required
                </div>

                <h1 className="text-[clamp(2.8rem,4.5vw,3.8rem)] leading-[1.12] text-[var(--ink)] tracking-[-0.03em] mb-6 font-extrabold">
                    Pass your inburgering exam
                </h1>

                <p className="text-[1.15rem] text-[var(--ink-soft)] leading-[1.7] mb-8 max-w-[480px]">
                    Practice the exact format of the real exam across all 5 modules — Lezen, Luisteren, KNM, Schrijven &amp; Spreken. Built around the actual DUO exam, not generic Dutch lessons. No payment needed while we&apos;re in beta — pricing may apply later.
                </p>

                <div className="space-y-3 mb-8">
                    {[
                        "All 5 modules: Lezen, Luisteren, KNM, Schrijven & Spreken",
                        "Matches the real computer-based exam format",
                        "Free to start — no account required",
                    ].map((item) => (
                        <div key={item} className="flex items-start gap-3 text-[0.95rem] text-[var(--ink-soft)]">
                            <CircleCheck className="h-5 w-5 text-[var(--green)] shrink-0 mt-0.5" />
                            {item}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <Link
                        href="/learn"
                        className="cta-primary inline-flex items-center gap-2.5 px-9 py-4 rounded-full font-semibold text-base"
                    >
                        {user ? "Continue practicing" : "Try a full mock exam"}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                        href="#modules"
                        className="inline-flex items-center gap-1.5 text-[var(--ink-soft)] font-medium text-[0.95rem] hover:text-[var(--ink)] transition-colors"
                    >
                        or browse all 5 modules
                        <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>

            {/* Right column — Product mockup */}
            <div className="relative hidden lg:block animate-reveal-delay-2">
                {/* Browser mockup */}
                <div className="bg-white rounded-[20px] shadow-[0_20px_80px_rgba(26,26,46,0.10),0_1px_3px_rgba(26,26,46,0.06)] overflow-hidden [transform:perspective(1000px)_rotateY(-3deg)_rotateX(1deg)] hover:[transform:perspective(1000px)_rotateY(0deg)_rotateX(0deg)] transition-transform duration-400">
                    {/* Mockup body */}
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-[0.72rem] font-semibold px-3 py-1 rounded-full tracking-[0.04em] uppercase bg-[var(--blue-soft)] text-[var(--blue)]">
                                Reading
                            </span>
                            <span className="text-[0.78rem] text-[var(--ink-muted)] font-medium">Question 7 / 20</span>
                        </div>

                        <div className="text-[1.05rem] font-semibold text-[var(--ink)] mb-1.5 leading-[1.5]">
                            What does the municipality send you after registration?
                        </div>
                        <div className="text-[0.92rem] text-[var(--ink-muted)] italic mb-5 pb-[18px] border-b border-[#f0ede6]">
                            &ldquo;Wat stuurt de gemeente u na inschrijving?&rdquo;
                        </div>

                        <div className="space-y-2.5">
                            {[
                                { letter: "A", text: "A passport", correct: false },
                                { letter: "B", text: "A letter with your BSN number", correct: true },
                                { letter: "C", text: "A residence permit", correct: false },
                                { letter: "D", text: "A DigiD login code", correct: false },
                            ].map((opt) => (
                                <div
                                    key={opt.letter}
                                    className={`flex items-center gap-3 px-[18px] py-3.5 rounded-[10px] border-[1.5px] text-[0.92rem] ${
                                        opt.correct
                                            ? "border-[var(--green)] bg-[var(--green-soft)] text-[var(--green)] font-semibold"
                                            : "border-[#ebe8e0] text-[var(--ink-soft)]"
                                    }`}
                                >
                                    <div
                                        className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[0.78rem] font-bold shrink-0 ${
                                            opt.correct ? "bg-[var(--green)] text-white" : "bg-[var(--cream-dark)]"
                                        }`}
                                    >
                                        {opt.correct ? <Check className="h-3 w-3" /> : opt.letter}
                                    </div>
                                    {opt.text}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-5 pt-[18px] border-t border-[#f0ede6]">
                            <div className="text-[0.82rem] text-[var(--ink-muted)] flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                14:32 remaining
                            </div>
                            <button className="bg-[var(--accent)] text-white px-5 py-2.5 rounded-full text-[0.82rem] font-semibold">
                                Next question →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
