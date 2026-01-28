export function FeatureCards() {
    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: "Realistic Simulations",
            description: "Practice on an interface that mirrors the actual DUO computer-based exam. Same layout, same timing, same question types.",
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Instant Feedback",
            description: "Get immediate results after each question with detailed explanations so you learn from every mistake.",
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            title: "All 5 Modules",
            description: "Complete coverage of KNM, Reading, Listening, Writing, and Speaking — everything you need to pass the inburgering exam.",
        },
    ];

    return (
        <section className="py-20 bg-[var(--landing-cream)]">
            <div className="max-w-6xl mx-auto px-8">
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--landing-navy)] text-center mb-14">
                    Complete Coverage for Every Exam
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="landing-card rounded-2xl p-8 text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--landing-orange)]/10 text-[var(--landing-orange)] mb-5">
                                {feature.icon}
                            </div>
                            <h3 className="font-sans-landing text-lg font-semibold text-[var(--landing-navy)] mb-3">
                                {feature.title}
                            </h3>
                            <p className="font-sans-landing text-sm text-[var(--landing-navy)]/60 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
