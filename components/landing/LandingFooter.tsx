"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const sections = [
    {
        title: "Practice Exams",
        links: [
            { href: "/learn", label: "All Modules" },
            { href: "/learn/knm/select", label: "KNM" },
            { href: "/learn/lezen/select", label: "Lezen" },
            { href: "/learn/luisteren/select", label: "Luisteren" },
            { href: "/learn/schrijven", label: "Schrijven" },
            { href: "/learn/spreken", label: "Spreken" },
        ],
    },
    {
        title: "Resources",
        links: [
            { href: "/guide", label: "Exam Guide" },
            { href: "/faq", label: "FAQ" },
            { href: "/blog", label: "Blog" },
            { href: "/blog/learning-resources", label: "Learning Resources" },
            { href: "/try", label: "Free Assessment" },
        ],
    },
    {
        title: "Legal",
        links: [
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
            { href: "/contact", label: "Contact" },
        ],
    },
];

export function LandingFooter() {
    const [openSection, setOpenSection] = useState<number | null>(null);

    const toggle = (i: number) => {
        setOpenSection(openSection === i ? null : i);
    };

    return (
        <footer className="border-t border-[var(--ink)]/[0.06] py-8 bg-[var(--cream)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-[var(--ink-muted)] text-sm">
                {/* Logo — mobile only */}
                <div className="md:hidden mb-6">
                    <span className="text-[1.2rem] tracking-[-0.02em]">
                        <span className="font-extrabold text-[var(--ink)]">pass</span>
                        <span className="font-bold text-[var(--accent)]">inburgering</span>
                    </span>
                </div>

                {/* Mobile accordion */}
                <div className="md:hidden divide-y divide-[var(--ink)]/[0.06]">
                    {sections.map((section, i) => (
                        <div key={section.title}>
                            <button
                                onClick={() => toggle(i)}
                                className="flex items-center justify-between w-full py-4 text-left cursor-pointer"
                            >
                                <span className="font-semibold text-[var(--ink)] text-[0.92rem]">{section.title}</span>
                                <ChevronDown
                                    className={`h-4 w-4 text-[var(--ink-muted)] transition-transform duration-200 ${
                                        openSection === i ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            {openSection === i && (
                                <div className="flex flex-col gap-3 pb-4 pl-1">
                                    {section.links.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="text-[var(--ink-muted)] hover:text-[var(--ink-soft)] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Desktop layout — unchanged */}
                <div className="hidden md:flex flex-row items-start justify-between gap-6">
                    <div className="flex flex-col gap-4">
                        <span>
                            © 2026{" "}
                            <span className="font-extrabold text-[var(--ink)]">pass</span>
                            <span className="font-bold text-[var(--accent)]">inburgering</span>
                            .com
                        </span>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <Link href="/guide" className="hover:text-[var(--ink-soft)] transition-colors">
                                Exam Guide
                            </Link>
                            <Link href="/faq" className="hover:text-[var(--ink-soft)] transition-colors">
                                FAQ
                            </Link>
                            <Link href="/blog" className="hover:text-[var(--ink-soft)] transition-colors">
                                Blog
                            </Link>
                            <Link href="/blog/learning-resources" className="hover:text-[var(--ink-soft)] transition-colors">
                                Learning Resources
                            </Link>
                            <Link href="/try" className="hover:text-[var(--ink-soft)] transition-colors">
                                Free Assessment
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 md:items-end">
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <Link href="/learn" className="hover:text-[var(--ink-soft)] transition-colors">
                                Practice Exams
                            </Link>
                            <Link href="/learn/knm/select" className="hover:text-[var(--ink-soft)] transition-colors">
                                KNM
                            </Link>
                            <Link href="/learn/lezen/select" className="hover:text-[var(--ink-soft)] transition-colors">
                                Lezen
                            </Link>
                            <Link href="/learn/luisteren/select" className="hover:text-[var(--ink-soft)] transition-colors">
                                Luisteren
                            </Link>
                            <Link href="/learn/schrijven" className="hover:text-[var(--ink-soft)] transition-colors">
                                Schrijven
                            </Link>
                            <Link href="/learn/spreken" className="hover:text-[var(--ink-soft)] transition-colors">
                                Spreken
                            </Link>
                        </div>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-[var(--ink-soft)] transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-[var(--ink-soft)] transition-colors">
                                Terms
                            </Link>
                            <Link href="/contact" className="hover:text-[var(--ink-soft)] transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Copyright — mobile */}
                <div className="md:hidden mt-6 pt-4 border-t border-[var(--ink)]/[0.06] flex flex-col gap-3">
                    <span>
                        © 2026{" "}
                        <span className="font-extrabold text-[var(--ink)]">pass</span>
                        <span className="font-bold text-[var(--accent)]">inburgering</span>
                        .com
                    </span>
                    <div className="flex gap-4 text-[0.82rem]">
                        <Link href="/privacy" className="hover:text-[var(--ink-soft)] transition-colors">Privacy</Link>
                        <span className="text-[var(--ink)]/10">·</span>
                        <Link href="/terms" className="hover:text-[var(--ink-soft)] transition-colors">Terms</Link>
                        <span className="text-[var(--ink)]/10">·</span>
                        <Link href="/contact" className="hover:text-[var(--ink-soft)] transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
