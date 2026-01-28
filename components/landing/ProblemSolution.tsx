export function ProblemSolution() {
    const problems = [
        "Paper exercises don't match the computer-based exam",
        "Expensive courses (€1,500+) with exam prep as an afterthought",
        "Failing means waiting months and paying €350 to retake",
    ];

    const solutions = [
        "Same interface, same timing, same question types as DUO",
        "Fraction of the cost — just focused exam practice",
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
                            Language courses don&apos;t prepare you for the actual test format
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
