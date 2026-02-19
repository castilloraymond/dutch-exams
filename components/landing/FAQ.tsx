"use client";

import { useState } from "react";
import { JsonLd } from "@/components/JsonLd";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "Is this the same format as the real exam?",
        answer: "Yes. Our practice exams mirror the real DUO computer-based exam — same question types, same interface layout, same timing constraints. You'll know exactly what to expect on test day.",
    },
    {
        question: "Which modules are available?",
        answer: "All five inburgering exam modules: Lezen (Reading), Luisteren (Listening), KNM (Dutch Society), Schrijven (Writing), and Spreken (Speaking). Each module has multiple mock exams with detailed explanations for every question.",
    },
    {
        question: "Do I need an account to start?",
        answer: "No. You can try a full mock exam right now without creating an account. A free account lets you save your progress across devices and track your scores over time.",
    },
    {
        question: "How is this different from the DUO practice materials?",
        answer: "DUO offers a limited set of sample questions. We have 46 full mock exams with 1,000+ questions, English explanations for every answer, and progress tracking across all modules so you can see exactly where you stand.",
    },
    {
        question: "Is my progress saved?",
        answer: "Your progress saves automatically in your browser. Create a free account to sync your progress across devices and keep your score history.",
    },
];

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
        },
    })),
};

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-[70px] px-6 lg:px-10 bg-white reveal">
            <JsonLd data={faqSchema} />
            <div className="max-w-[768px] mx-auto">
                <div className="text-center mb-9">
                    <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-4">
                        FAQ
                    </div>
                    <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] font-extrabold mb-5">
                        Your questions, answered
                    </h2>
                    <p className="text-[1.05rem] text-[var(--ink-soft)] leading-[1.7]">
                        Everything you need to know before getting started
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-[16px] border border-[var(--ink)]/[0.05] overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
                            >
                                <span className="font-semibold text-[var(--ink)] pr-4">
                                    {faq.question}
                                </span>
                                <svg
                                    className={`w-5 h-5 text-[var(--accent)] flex-shrink-0 transition-transform duration-200 ${
                                        openIndex === i ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-200 ${
                                    openIndex === i ? "max-h-96" : "max-h-0"
                                }`}
                            >
                                <p className="px-6 pb-5 text-[var(--ink-soft)] leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
