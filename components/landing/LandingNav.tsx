"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleUser, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function LandingNav() {
    const { user, loading } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="font-sans-landing relative px-4 sm:px-6 lg:px-8 py-5 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
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
                            className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors cursor-pointer hidden sm:block"
                        >
                            <CircleUser className="h-6 w-6" />
                        </Link>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors cursor-pointer hidden sm:block"
                        >
                            Log in
                        </Link>
                    )}
                    <Link
                        href="/try"
                        className="cta-primary px-5 py-2.5 text-white rounded-lg text-sm font-medium cursor-pointer hidden sm:block"
                    >
                        Start Practice
                    </Link>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="sm:hidden text-[var(--landing-navy)] cursor-pointer"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="sm:hidden absolute top-full left-0 right-0 bg-[var(--landing-cream)] border-b border-[var(--landing-navy)]/10 shadow-lg z-50">
                    <div className="flex flex-col px-4 py-4 gap-3">
                        <Link
                            href="#modules"
                            onClick={() => setMenuOpen(false)}
                            className="text-[var(--landing-navy)]/70 hover:text-[var(--landing-navy)] transition-colors py-2"
                        >
                            Modules
                        </Link>
                        {!loading && user ? (
                            <Link
                                href="/profile"
                                onClick={() => setMenuOpen(false)}
                                className="text-[var(--landing-navy)]/70 hover:text-[var(--landing-navy)] transition-colors py-2 flex items-center gap-2"
                            >
                                <CircleUser className="h-5 w-5" />
                                Profile
                            </Link>
                        ) : (
                            <Link
                                href="/auth/login"
                                onClick={() => setMenuOpen(false)}
                                className="text-[var(--landing-navy)]/70 hover:text-[var(--landing-navy)] transition-colors py-2"
                            >
                                Log in
                            </Link>
                        )}
                        <Link
                            href="/try"
                            onClick={() => setMenuOpen(false)}
                            className="cta-primary px-5 py-2.5 text-white rounded-lg text-sm font-medium cursor-pointer text-center"
                        >
                            Start Practice
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
