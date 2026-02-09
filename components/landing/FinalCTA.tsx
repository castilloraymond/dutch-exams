"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export function FinalCTA() {
    const { user } = useAuth();

    return (
        <section className="py-20 bg-gradient-to-b from-[var(--landing-navy)] to-[#0F1D33]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
                    Stop stressing.<br />Start preparing efficiently.
                </h2>
                <p className="font-sans-landing text-white/60 mb-10">
                    Join 2,400+ professionals who prepared on their own schedule and passed.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {user ? (
                        <Link
                            href="/learn"
                            className="cta-primary px-8 py-4 text-white rounded-full font-medium font-sans-landing cursor-pointer"
                        >
                            Continue to Practice
                        </Link>
                    ) : (
                        <Link
                            href="/try"
                            className="cta-primary px-8 py-4 text-white rounded-full font-medium font-sans-landing cursor-pointer"
                        >
                            Try a Sample Exam
                        </Link>
                    )}
                    <Link
                        href="#modules"
                        className="px-8 py-4 border border-white/20 text-white rounded-full font-medium font-sans-landing hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        Explore Modules
                    </Link>
                </div>
            </div>
        </section>
    );
}
