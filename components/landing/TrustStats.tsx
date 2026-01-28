export function TrustStats() {
    const companies = ["Booking.com", "ING", "Philips", "ASML", "Uber"];

    return (
        <section className="py-10 border-y border-[var(--landing-navy)]/5 bg-[var(--landing-cream)]">
            <div className="max-w-5xl mx-auto px-8 text-center">
                <p className="font-sans-landing text-sm text-[var(--landing-gray,#6B7280)] mb-4">
                    Trusted by expats working at
                </p>
                <div className="flex flex-wrap justify-center gap-x-10 gap-y-2">
                    {companies.map((name) => (
                        <span key={name} className="font-sans-landing text-lg font-semibold text-[var(--landing-navy)]/30">
                            {name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
