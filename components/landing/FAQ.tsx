"use client";

import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs: FAQItem[] = [
        {
            question: "How similar is this to the real DUO exam?",
            answer: "Our practice exams are designed to mirror the actual DUO computer-based test as closely as possible. Same interface layout, same question types, same timing constraints. Many users report that the real exam feels familiar after practicing with us.",
        },
        {
            question: "What's included in the free trial?",
            answer: "You get full access to sample questions from all 5 modules: KNM (Dutch Society), Reading, Listening, Writing, and Speaking. Try as many practice questions as you like to see if our approach works for you.",
        },
        {
            question: "Can I practice on my phone?",
            answer: "Yes! Our platform works on desktop, tablet, and mobile devices. While we recommend practicing on a computer (since the real exam is computer-based), you can review and study anywhere.",
        },
        {
            question: "How long should I practice before the exam?",
            answer: "Most users practice for 2-4 weeks before their exam. We recommend taking full practice exams until you consistently score above 80%. Our progress tracking helps you know when you're ready.",
        },
        {
            question: "What if I don't pass?",
            answer: "Everyone learns at their own pace. If you don't pass, you can retake the official exam. Our platform helps you identify weak areas so you can focus your studying. Many users who initially struggled went on to pass after targeted practice.",
        },
    ];

    return (
        <section className="py-20 bg-[var(--landing-cream)]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--landing-navy)] mb-4">
                        Your Questions, Answered
                    </h2>
                    <p className="font-sans-landing text-[var(--landing-navy)]/60">
                        Everything you need to know before getting started
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-[var(--landing-navy)]/5 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
                            >
                                <span className="font-sans-landing font-semibold text-[var(--landing-navy)] pr-4">
                                    {faq.question}
                                </span>
                                <svg
                                    className={`w-5 h-5 text-[var(--landing-orange)] flex-shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""
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
                                className={`overflow-hidden transition-all duration-200 ${openIndex === i ? "max-h-96" : "max-h-0"
                                    }`}
                            >
                                <p className="px-6 pb-5 font-sans-landing text-[var(--landing-navy)]/70 leading-relaxed">
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
