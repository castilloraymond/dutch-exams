"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CircleUser, Menu, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function LandingNav() {
    const { user, isLoaded } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            if (y > lastScrollY.current && y > 60) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            lastScrollY.current = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 py-4 bg-[var(--cream)]/85 backdrop-blur-[20px] border-b border-[var(--ink)]/[0.06] transition-transform duration-300 ${
                hidden && !menuOpen ? "-translate-y-full sm:translate-y-0" : "translate-y-0"
            }`}
        >
            <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center cursor-pointer">
                    <span className="text-[1.35rem] tracking-[-0.02em]">
                        <span className="font-extrabold text-[var(--ink)]">pass</span><span className="font-bold text-[var(--accent)]">inburgering</span>
                    </span>
                </Link>

                <div className="flex items-center gap-3 sm:gap-8">
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
                        Exam Resources
                    </Link>
                    {isLoaded && !user && (
                        <Link
                            href="/auth/login"
                            className="text-[0.9rem] font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors hidden sm:block"
                        >
                            Log In
                        </Link>
                    )}
                    {isLoaded && user ? (
                        <Link
                            href="/profile"
                            className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors cursor-pointer hidden sm:block"
                        >
                            <CircleUser className="h-5 w-5" />
                        </Link>
                    ) : null}
                    {isLoaded && !user && (
                        <Link
                            href="/auth/signup"
                            className="hidden sm:inline-flex border border-[var(--ink)]/20 text-[var(--ink)] hover:bg-[var(--ink)]/5 px-6 py-2.5 rounded-full font-semibold text-[0.88rem] transition-all duration-250"
                        >
                            Sign Up
                        </Link>
                    )}
                    <Link
                        href="/try"
                        className="hidden sm:inline-flex bg-[var(--ink)] text-[var(--cream)] px-6 py-2.5 rounded-full font-semibold text-[0.88rem] hover:bg-[var(--accent)] hover:translate-y-[-1px] transition-all duration-250"
                    >
                        Start practicing
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
                            Exam Resources
                        </Link>
                        {isLoaded && !user && (
                            <>
                                <Link
                                    href="/auth/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors py-2"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    onClick={() => setMenuOpen(false)}
                                    className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors py-2"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                        {isLoaded && user && (
                            <Link
                                href="/profile"
                                onClick={() => setMenuOpen(false)}
                                className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors py-2 flex items-center gap-2"
                            >
                                <CircleUser className="h-5 w-5" />
                                Profile
                            </Link>
                        )}
                        <Link
                            href="/try"
                            onClick={() => setMenuOpen(false)}
                            className="bg-[var(--ink)] text-[var(--cream)] px-6 py-2.5 rounded-full font-semibold text-sm text-center hover:bg-[var(--accent)] transition-all"
                        >
                            Start practicing
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
