export function WhyUs() {
    const features = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: "Real DUO Exam Interface",
            description: "Practice on an exact replica of the actual computer-based exam — not generic flashcards.",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Instant Feedback",
            description: "Get detailed explanations after every question so you learn from mistakes.",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            title: "All 5 Exam Modules",
            description: "Complete coverage: KNM, Reading, Listening, Writing, and Speaking.",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: "Progress Tracking",
            description: "Know exactly when you're ready — track your scores across all modules.",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Real Exam Timing",
            description: "Practice under timed conditions so exam day feels familiar.",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
            ),
            title: "Practice Anywhere",
            description: "Works on desktop, tablet, and mobile — study whenever you have time.",
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-[var(--landing-cream)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <span className="font-sans-landing inline-block text-xs font-medium tracking-wide uppercase text-[var(--landing-orange)] bg-[var(--landing-orange)]/10 px-3 py-1.5 rounded-full mb-4">
                        Why Choose Us
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--landing-navy)]">
                        Everything You Need to Pass
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
