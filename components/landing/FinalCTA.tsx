"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function FinalCTA() {
    const { user } = useAuth();

    return (
        <section className="py-[80px] px-6 lg:px-10 text-center bg-[var(--ink)] relative overflow-hidden">
            {/* Subtle radial accent gradient */}
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(232,99,43,0.12)_0%,transparent_70%)] pointer-events-none" />

            <h2 className="text-[clamp(2.2rem,3.5vw,3rem)] leading-[1.2] text-white tracking-[-0.03em] mb-5 font-extrabold relative">
                Walk into your exam over-prepared.
            </h2>
            <p className="text-white/60 text-[1.1rem] max-w-[500px] mx-auto mb-10 leading-[1.7] relative">
                1,200+ drill questions. Real exam format. Tips for every answer. Start drilling — your first test is free.
            </p>
            <Link
                href={user ? "/learn" : "/try"}
                className="cta-primary inline-flex items-center gap-2.5 px-11 py-[18px] rounded-full font-semibold text-[1.08rem] relative"
            >
                {user ? "Continue practicing" : "Start free practice test"}
                <ArrowRight className="h-4 w-4" />
            </Link>
        </section>
    );
}
