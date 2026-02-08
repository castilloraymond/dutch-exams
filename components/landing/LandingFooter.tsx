import Link from "next/link";

export function LandingFooter() {
    return (
        <footer className="border-t border-[var(--landing-navy)]/10 py-8 bg-[var(--landing-cream)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 font-sans-landing text-[var(--landing-navy)]/40 text-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-4">
                        <span>© 2026 <span className="text-[var(--landing-orange)] font-semibold">pass</span>inburgering.com</span>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <Link href="/guide" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                Exam Guide
                            </Link>
                            <Link href="/faq" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                FAQ
                            </Link>
                            <Link href="/blog" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                Blog
                            </Link>
                            <Link href="/blog/learning-resources" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                Learning Resources
                            </Link>
                            <Link href="/try" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                Free Assessment
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 md:items-end">
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <Link href="/learn" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                Practice Exams
                            </Link>
                            <Link href="/learn/knm/select" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                KNM
                            </Link>
                            <Link href="/learn/lezen/select" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                Lezen
                            </Link>
                            <Link href="/learn/luisteren/select" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                Luisteren
                            </Link>
                            <Link href="/learn/schrijven" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                Schrijven
                            </Link>
                            <Link href="/learn/spreken" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                Spreken
                            </Link>
                        </div>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                Terms
                            </Link>
                            <Link href="/contact" className="hover:text-[var(--landing-navy)]/60 transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
