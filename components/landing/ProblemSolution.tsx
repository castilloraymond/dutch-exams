export function ProblemSolution() {
    const problems = [
        "Group classes designed for beginners waste your time when you're already at A2",
        "Private tutors cost €30–60/hour and require scheduling around your work",
        "Outdated study materials don't cover the 2025 KNM and Spreken format changes",
    ];

    const solutions = [
        "Exam-focused practice — skip the fluff, practice the actual question types",
        "Study at midnight, during lunch, or on the train — 20 minutes is enough",
        "Always up to date — built for the current exam format, not last year's",
    ];

    const pairs = problems.map((problem, i) => ({
        problem,
        solution: solutions[i],
    }));

    return (
        <section className="py-20 bg-[var(--landing-navy)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-10 md:gap-16">
                    {/* Problem */}
                    <div>
                        <span className="font-sans-landing text-sm font-medium text-white/40 tracking-wide uppercase">
                            The Problem
                        </span>
                        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mt-3 mb-8">
                            Traditional prep wastes your most valuable resource: time
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
