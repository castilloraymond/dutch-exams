export function Testimonials() {
    const testimonials = [
        {
            quote: "After months of Duolingo and €500 on a tutor, I still wasn't confident. Two weeks of practice tests here and I passed first try.",
            name: "Sarah K.",
            role: "Software Engineer at Booking.com",
        },
        {
            quote: "The computer-based practice was exactly what I needed. The real exam felt familiar, not stressful. Highly recommend for busy professionals.",
            name: "Marco V.",
            role: "Product Manager at ASML",
        },
        {
            quote: "I have very little time between work and family. The 15-minute practice sessions fit perfectly into my lunch breaks. Passed KNM on my first attempt.",
            name: "Priya S.",
            role: "Finance Lead at Adyen",
        },
    ];

    return (
        <section className="py-20 bg-[var(--landing-navy)]">
            <div className="max-w-6xl mx-auto px-8">
                <div className="font-sans-landing text-white/50 text-sm text-center mb-12 uppercase tracking-wide">
                    What Expats Say
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="text-center">
                            <blockquote className="font-serif text-lg text-white leading-relaxed mb-6">
                                "{t.quote}"
                            </blockquote>
                            <div className="font-sans-landing">
                                <div className="text-white font-medium">{t.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
