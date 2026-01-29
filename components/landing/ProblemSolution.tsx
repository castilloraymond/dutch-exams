export function ProblemSolution() {
    const problems = [
        "Duolingo teaches Dutch, but won't prepare you for the exam format",
        "Language tutors cost €30-50/hour and take months of your time",
        "Failing means waiting months and paying €350 to retake",
    ];

    const solutions = [
        "Practice on the exact interface and question types you'll face",
        "Self-paced prep at a fraction of the cost of tutoring",
        "Built by expats who passed and know exactly what to expect",
    ];

    const pairs = problems.map((problem, i) => ({
        problem,
        solution: solutions[i],
    }));

    return (
        <section className="py-20 bg-[var(--landing-navy)]">
            <div className="max-w-6xl mx-auto px-8">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Problem */}
                    <div>
                        <span className="font-sans-landing text-sm font-medium text-white/40 tracking-wide uppercase">
                            The Problem
                        </span>
                        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mt-3 mb-8">
                            Apps and tutors won&apos;t prepare you for the actual exam
                        </h2>
                        <div className="space-y-5 font-sans-landing">
                            {pairs.map((pair, i) => (
                                <div key={i} className="flex items-start gap-4 text-white/70">
                                    <span className="text-[var(--landing-red)] font-light text-lg">✗</span>
                                    <span>{pair.problem}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Solution */}
                    <div>
                        <span className="font-sans-landing text-sm font-medium text-white/40 tracking-wide uppercase">
                            The Solution
                        </span>
                        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mt-3 mb-8">
                            Practice on simulations that feel like the real thing
                        </h2>
                        <div className="space-y-5 font-sans-landing">
                            {pairs.map((pair, i) => (
                                <div key={i} className="flex items-start gap-4 text-white/90">
                                    <span className="text-[var(--landing-green)] font-medium text-lg">✓</span>
                                    <span>{pair.solution}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
