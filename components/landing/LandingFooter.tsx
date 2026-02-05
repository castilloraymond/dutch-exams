import Link from "next/link";

export function LandingFooter() {
    return (
        <footer className="border-t border-[var(--landing-navy)]/10 py-8 bg-[var(--landing-cream)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 font-sans-landing flex flex-col md:flex-row items-center justify-between gap-4 text-[var(--landing-navy)]/40 text-sm">
                <span>© 2026 <span className="text-[var(--landing-orange)] font-semibold">pass</span>inburgering.com • Made in Amsterdam 🇳🇱</span>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-[var(--landing-navy)]/60 transition-colors cursor-pointer">
                        Privacy
                    </Link>
                    <Link href="/terms" className="hover:text-[var(--landing-navy)]/60 transition-colors cursor-pointer">
                        Terms
                    </Link>
                    <Link href="/contact" className="hover:text-[var(--landing-navy)]/60 transition-colors cursor-pointer">
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
}
