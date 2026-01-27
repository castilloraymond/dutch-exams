import Link from "next/link";

export function LandingNav() {
    return (
        <nav className="font-sans-landing flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
            <Link href="/" className="flex items-center">
                <span className="text-[var(--landing-navy)] text-lg">
                    <span className="font-bold text-[var(--landing-orange)]">pass</span><span className="font-semibold">inburgering</span>
                </span>
            </Link>
            <div className="flex items-center gap-6 text-sm">
                <Link
                    href="#modules"
                    className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors hidden sm:block"
                >
                    Modules
                </Link>
                <Link
                    href="/learn"
                    className="px-5 py-2.5 border border-[var(--landing-navy)]/20 text-[var(--landing-navy)] rounded-lg text-sm font-medium hover:bg-[var(--landing-navy)]/5 transition-colors"
                >
                    Start Practice
                </Link>
            </div>
        </nav>
    );
}
