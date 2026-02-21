"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function FinalCTA() {
    const { user } = useAuth();

    return (
        <section className="py-14 sm:py-[80px] px-5 sm:px-6 lg:px-10 text-center bg-[var(--ink)] relative overflow-hidden">
            {/* Subtle radial accent gradient */}
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(232,99,43,0.12)_0%,transparent_70%)] pointer-events-none" />

            <h2 className="text-[1.8rem] sm:text-[clamp(2.2rem,3.5vw,3rem)] leading-[1.2] text-white tracking-[-0.03em] mb-4 sm:mb-5 font-extrabold relative">
                Ready to start practicing?
            </h2>
            <p className="text-white/60 text-[0.95rem] sm:text-[1.1rem] max-w-[500px] mx-auto mb-8 sm:mb-10 leading-[1.6] sm:leading-[1.7] relative">
                46 mock exams across all 5 modules. Real exam format. Free to start — no account required.
            </p>
            <Link
                href="/learn"
                className="cta-primary inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-11 py-4 sm:py-[18px] rounded-full font-semibold text-base sm:text-[1.08rem] relative max-w-[340px]"
            >
                {user ? "Continue practicing" : "Try a free mock exam"}
                <ArrowRight className="h-4 w-4" />
            </Link>
        </section>
    );
}
