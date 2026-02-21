import Link from "next/link";

export function LandingFooter() {
    return (
        <footer className="border-t border-[var(--ink)]/[0.06] py-6 sm:py-8 bg-[var(--cream)]">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 text-[var(--ink-muted)] text-[0.82rem] sm:text-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <span>
                            © 2026{" "}
                            <span className="font-extrabold text-[var(--ink)]">pass</span>
                            <span className="font-bold text-[var(--accent)]">inburgering</span>
                            .com
                        </span>
                        <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
                            <Link href="/guide" className="hover:text-[var(--ink-soft)] transition-colors">
                                Exam Guide
                            </Link>
                            <Link href="/faq" className="hover:text-[var(--ink-soft)] transition-colors">
                                FAQ
                            </Link>
                            <Link href="/blog" className="hover:text-[var(--ink-soft)] transition-colors">
                                Blog
                            </Link>
                            <Link href="/blog/learning-resources" className="hover:text-[var(--ink-soft)] transition-colors">
                                Resources
                            </Link>
                            <Link href="/try" className="hover:text-[var(--ink-soft)] transition-colors">
                                Free Assessment
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:gap-4 md:items-end">
                        <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
                            <Link href="/learn" className="hover:text-[var(--ink-soft)] transition-colors">
                                Practice Exams
                            </Link>
                            <Link href="/learn/knm/select" className="hover:text-[var(--ink-soft)] transition-colors">
                                KNM
                            </Link>
                            <Link href="/learn/lezen/select" className="hover:text-[var(--ink-soft)] transition-colors">
                                Lezen
                            </Link>
                            <Link href="/learn/luisteren/select" className="hover:text-[var(--ink-soft)] transition-colors">
                                Luisteren
                            </Link>
                            <Link href="/learn/schrijven" className="hover:text-[var(--ink-soft)] transition-colors">
                                Schrijven
                            </Link>
                            <Link href="/learn/spreken" className="hover:text-[var(--ink-soft)] transition-colors">
                                Spreken
                            </Link>
                        </div>
                        <div className="flex gap-4 sm:gap-6">
                            <Link href="/privacy" className="hover:text-[var(--ink-soft)] transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-[var(--ink-soft)] transition-colors">
                                Terms
                            </Link>
                            <Link href="/contact" className="hover:text-[var(--ink-soft)] transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
