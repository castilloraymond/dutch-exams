export function WhyUs() {
    const features = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            title: "450+ Practice Questions",
            description: "Comprehensive question bank covering every topic across all 5 exam modules. Drill until you've mastered each one.",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: "14 Full-Length Mock Exams",
            description: "Timed practice tests for KNM, Reading, and Listening that replicate the real DUO exam format.",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Instant Scoring & Explanations",
            description: "Get your score immediately. Review detailed explanations for every question to learn from mistakes.",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: "Exam-Realistic Interface",
            description: "Practice on an interface modeled after the official DUO computer-based test — same layout and question types.",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: "Progress Tracking",
            description: "See exactly where you stand across all modules. Know when you're ready to book your exam.",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Study on Your Schedule",
            description: "Desktop, tablet, and mobile. Study at midnight, during lunch, or on the train — 20 minutes is enough.",
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-[var(--landing-cream)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <span className="font-sans-landing inline-block text-xs font-medium tracking-wide uppercase text-[var(--landing-orange)] bg-[var(--landing-orange)]/10 px-3 py-1.5 rounded-full mb-4">
                        Complete Exam Prep
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--landing-navy)]">
                        Everything You Need to Pass — Nothing You Don't
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-[var(--landing-navy)]/5 hover:border-[var(--landing-orange)]/30 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--landing-orange)]/10 flex items-center justify-center text-[var(--landing-orange)]">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="font-sans-landing font-semibold text-[var(--landing-navy)] mb-1">
                                    {feature.title}
                                </h3>
                                <p className="font-sans-landing text-sm text-[var(--landing-navy)]/60 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
