export function TrustStats() {
    const stats = [
        { value: "14", label: "Mock Exams" },
        { value: "450+", label: "Practice Questions" },
        { value: "5", label: "Exam Modules" },
        { value: "2025", label: "Exam Format", prefix: "Updated" },
    ];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="font-serif text-3xl md:text-4xl font-bold text-[var(--landing-navy)]">
                                {stat.prefix && <span className="text-[var(--landing-orange)] text-lg font-sans-landing font-medium block mb-1">{stat.prefix}</span>}
                                {stat.value}
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
                        Used by professionals at
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
