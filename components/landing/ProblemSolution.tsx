export function ProblemSolution() {
    const problems = [
        "Duolingo builds vocabulary, not exam readiness — you can have a 200-day streak and still fail",
        "Tutors teach conversation, not test-taking strategy — €40/hour with no focus on the actual format",
        "Failing costs €350, months of delay, and real consequences for your 30% ruling or PR timeline",
    ];

    const solutions = [
        "Practice on an interface modeled after the DUO computer-based exam — same format, same question types",
        "14 full-length timed mock exams so nothing on test day surprises you",
        "Self-paced — study at midnight, on lunch, whenever you have 20 minutes",
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
                            Knowing Dutch isn't the same as passing the exam
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
                            Drill the exact questions and format you'll face on test day
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
