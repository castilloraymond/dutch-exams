"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleUser, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function LandingNav() {
    const { user, loading } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 py-4 bg-[var(--cream)]/85 backdrop-blur-[20px] border-b border-[var(--ink)]/[0.06] transition-all duration-300">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center cursor-pointer">
                    <span className="text-[1.35rem] tracking-[-0.02em]">
                        <span className="font-extrabold text-[var(--ink)]">pass</span><span className="font-bold text-[var(--accent)]">inburgering</span>
                    </span>
                </Link>

                <div className="flex items-center gap-8">
                    <Link
                        href="#how"
                        className="text-[0.9rem] font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors hidden sm:block"
                    >
                        How it works
                    </Link>
                    <a
                        href="#modules"
                        className="text-[0.9rem] font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors hidden sm:block"
                    >
                        Modules
                    </a>
                    <Link
                        href="/blog"
                        className="text-[0.9rem] font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors hidden sm:block"
                    >
                        Blog
                    </Link>
                    {!loading && user ? (
                        <Link
                            href="/profile"
                            className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors cursor-pointer hidden sm:block"
                        >
                            <CircleUser className="h-5 w-5" />
                        </Link>
                    ) : null}
                    <Link
                        href="/learn"
                        className="bg-[var(--ink)] text-[var(--cream)] px-6 py-2.5 rounded-full font-semibold text-[0.88rem] hover:bg-[var(--accent)] hover:translate-y-[-1px] transition-all duration-250 hidden sm:block"
                    >
                        {!loading && user ? "Start practicing" : "Try a mock exam"}
                    </Link>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="sm:hidden text-[var(--ink)] cursor-pointer"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="sm:hidden absolute top-full left-0 right-0 bg-[var(--cream)]/95 backdrop-blur-[20px] border-b border-[var(--ink)]/[0.06] shadow-lg z-50">
                    <div className="flex flex-col px-6 py-4 gap-3">
                        <Link
                            href="#how"
                            onClick={() => setMenuOpen(false)}
                            className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors py-2"
                        >
                            How it works
                        </Link>
                        <a
                            href="#modules"
                            onClick={() => setMenuOpen(false)}
                            className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors py-2"
                        >
                            Modules
                        </a>
                        <Link
                            href="/blog"
                            onClick={() => setMenuOpen(false)}
                            className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors py-2"
                        >
                            Blog
                        </Link>
                        {!loading && user ? (
                            <Link
                                href="/profile"
                                onClick={() => setMenuOpen(false)}
                                className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors py-2 flex items-center gap-2"
                            >
                                <CircleUser className="h-5 w-5" />
                                Profile
                            </Link>
                        ) : (
                            <Link
                                href="/auth/login"
                                onClick={() => setMenuOpen(false)}
                                className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors py-2"
                            >
                                Log in
                            </Link>
                        )}
                        <Link
                            href="/learn"
                            onClick={() => setMenuOpen(false)}
                            className="bg-[var(--ink)] text-[var(--cream)] px-6 py-2.5 rounded-full font-semibold text-sm text-center hover:bg-[var(--accent)] transition-all"
                        >
                            {!loading && user ? "Start practicing" : "Try a mock exam"}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
