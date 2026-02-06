"use client";

import Link from "next/link";
import { CircleUser } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function LandingNav() {
    const { user, loading } = useAuth();

    return (
        <nav className="font-sans-landing flex items-center justify-between px-4 sm:px-6 lg:px-8 py-5 max-w-7xl mx-auto">
            <Link href="/" className="flex items-center cursor-pointer">
                <span className="text-[var(--landing-navy)] text-lg">
                    <span className="font-bold text-[var(--landing-orange)]">pass</span><span className="font-semibold">inburgering</span>
                </span>
            </Link>
            <div className="flex items-center gap-6 text-sm">
                <Link
                    href="#modules"
                    className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors hidden sm:block cursor-pointer"
                >
                    Modules
                </Link>
                {!loading && user ? (
                    <Link
                        href="/profile"
                        className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors cursor-pointer"
                    >
                        <CircleUser className="h-6 w-6" />
                    </Link>
                ) : (
                    <Link
                        href="/auth/login"
                        className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors cursor-pointer"
                    >
                        Log in
                    </Link>
                )}
                <Link
                    href="/try"
                    className="cta-primary px-5 py-2.5 text-white rounded-lg text-sm font-medium cursor-pointer"
                >
                    Start Practice
                </Link>
            </div>
        </nav>
    );
}
