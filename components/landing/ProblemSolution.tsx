export function ProblemSolution() {
    const problems = [
        "Duolingo teaches Dutch, not the exam format",
        "Tutors are expensive and slow (€40-80/hour)",
        "Courses take 6+ months you don't have",
        "Practice books don't simulate computer-based tests",
    ];

    const solutions = [
        "Computer-based interface mirrors the actual test",
        "Questions calibrated to A0-A1 exam requirements",
        "Practice in 15-minute sessions that fit your schedule",
        "Instant feedback so you learn from mistakes",
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-8">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Problem */}
                    <div>
                        <span className="font-sans-landing text-sm font-medium text-[var(--landing-navy)]/60 tracking-wide uppercase">
                            The Problem
                        </span>
                        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--landing-navy)] mt-3 mb-8">
                            Current options don't prepare you for the actual exam
                        </h2>
                        <div className="space-y-5 font-sans-landing">
                            {problems.map((item, i) => (
                                <div key={i} className="flex items-start gap-4 text-[var(--landing-navy)]/80">
                                    <span className="text-red-400 font-light text-lg">✗</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Solution */}
                    <div>
                        <span className="font-sans-landing text-sm font-medium text-[var(--landing-navy)]/60 tracking-wide uppercase">
                            The Solution
                        </span>
                        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--landing-navy)] mt-3 mb-8">
                            Practice like it's the real exam
                        </h2>
                        <div className="space-y-5 font-sans-landing">
                            {solutions.map((item, i) => (
                                <div key={i} className="flex items-start gap-4 text-[var(--landing-navy)]">
                                    <span className="text-[var(--landing-green)] font-medium text-lg">✓</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

