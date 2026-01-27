export function TrustStats() {
    const stats = [
        { value: "93%", label: "Pass rate" },
        { value: "2,500+", label: "Practice questions" },
        { value: "A0-A1", label: "Level aligned" },
        { value: "6", label: "Exam modules" },
    ];

    return (
        <section className="py-12 border-y border-[var(--landing-navy)]/5 bg-[var(--landing-cream)]">
            <div className="max-w-4xl mx-auto px-8">
                <div className="font-sans-landing grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <div className="text-2xl font-semibold text-[var(--landing-navy)]">
                                {stat.value}
                            </div>
                            <div className="text-sm text-[var(--landing-navy)]/50">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
