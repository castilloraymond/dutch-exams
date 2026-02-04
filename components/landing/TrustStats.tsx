export function TrustStats() {
    const stats = [
        { value: "5,000+", label: "Questions Practiced" },
        { value: "500+", label: "Practice Exams Taken" },
        { value: "4.8", label: "User Rating", suffix: "★" },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="font-sans-landing inline-block text-xs font-medium tracking-wide uppercase text-[var(--landing-orange)] bg-[var(--landing-orange)]/10 px-3 py-1.5 rounded-full mb-4">
                        Proven Results
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--landing-navy)]">
                        Join Thousands Who Passed
                    </h2>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="font-serif text-3xl md:text-4xl font-bold text-[var(--landing-navy)]">
                                {stat.value}
                                {stat.suffix && <span className="text-[var(--landing-orange)]">{stat.suffix}</span>}
                            </div>
                            <div className="font-sans-landing text-sm text-[var(--landing-navy)]/60 mt-1">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function TrustedBy() {
    const companies = ["Booking.com", "ING", "Philips", "ASML", "Uber"];

    return (
        <section className="py-8 border-y border-[var(--landing-navy)]/5 bg-[var(--landing-cream)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="font-sans-landing text-xs text-[var(--landing-gray,#6B7280)] mb-3 uppercase tracking-wide">
                        Trusted by expats working at
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                        {companies.map((name) => (
                            <span key={name} className="font-sans-landing text-base font-semibold text-[var(--landing-navy)]/30">
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
