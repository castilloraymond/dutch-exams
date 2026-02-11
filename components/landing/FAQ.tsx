"use client";

import { useState } from "react";
import { JsonLd } from "@/components/JsonLd";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "How similar is this to the real DUO exam?",
        answer: "Our practice exams are modeled after the actual DUO computer-based test. Similar interface layout, same question types, same timing constraints. We study the real exam format closely so your practice feels realistic.",
    },
    {
        question: "What's included for free?",
        answer: "A 10-question assessment across all 5 modules with no signup required — see your readiness score in minutes. Create a free account to access the full question bank, topic drills, and mock exams.",
    },
    {
        question: "Can I practice on my phone?",
        answer: "Yes! Our platform works on desktop, tablet, and mobile devices. While we recommend practicing on a computer (since the real exam is computer-based), you can review and study anywhere.",
    },
    {
        question: "How long should I practice before the exam?",
        answer: "Most professionals practice 2–4 weeks, 20 minutes per day. We recommend taking full practice exams until you consistently score above 80%. Our progress tracking helps you know when you're ready.",
    },
    {
        question: "What if I don't pass?",
        answer: "Failing means a months-long wait and a €350 retake fee. That's exactly why we built this — to help you pass the first time. Our mock exams and detailed feedback identify your weak areas so you can fix them before test day.",
    },
    {
        question: "I'm on the 30% ruling. Do I need to inburger?",
        answer: "No — the 30% ruling exempts you from mandatory inburgering. However, if you want permanent residence or Dutch citizenship, you'll need to pass the inburgering exams at A2 level under the Wi2013 framework.",
    },
    {
        question: "What changed about the exams in 2025?",
        answer: "The KNM (Knowledge of Dutch Society) exam was overhauled in July 2025 with new topics and question formats. The Spreken (Speaking) exam format also changed in March 2025. Our practice materials are updated to reflect these changes.",
    },
    {
        question: "Do I need A2 or B1?",
        answer: "Most kennismigranten need A2 level, regardless of when they decide to integrate. B1 is only required for certain exemption routes. If you're unsure, A2 is the standard requirement for the inburgering exams.",
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
        <section className="py-[70px] px-6 lg:px-10 bg-[var(--cream)] reveal">
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
