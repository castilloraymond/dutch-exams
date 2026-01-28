"use client";

import Link from "next/link";

export function LandingNav() {
    const scrollToEmailCapture = () => {
        const element = document.getElementById("email-capture");
        if (element) {
            const elementRect = element.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
            window.scrollTo({
                top: middle,
                behavior: "smooth"
            });
        }
    };

    return (
        <nav className="font-sans-landing flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
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
                <button
                    onClick={scrollToEmailCapture}
                    className="cta-primary px-5 py-2.5 text-white rounded-lg text-sm font-medium cursor-pointer"
                >
                    Start Practice
                </button>
            </div>
        </nav>
    );
}
