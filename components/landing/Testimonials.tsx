export function Testimonials() {
    return (
        <section className="py-20 bg-[var(--landing-navy)]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="font-sans-landing text-white/50 text-sm text-center mb-8 uppercase tracking-wide">
                    Why I Built This
                </div>

                <div className="text-center">
                    <blockquote className="font-serif text-xl md:text-2xl text-white leading-relaxed mb-8">
                        &ldquo;Three weeks before my exam, I panicked. I&apos;d done Duolingo for months and even paid for a tutor, but when I took my first mock exam—I failed. Hard.
                    </blockquote>

                    <p className="font-sans-landing text-white/70 text-lg leading-relaxed mb-6">
                        The problem wasn&apos;t vocabulary. It was that I&apos;d never practiced under real exam conditions. I needed drills. I needed practice tests that felt like the actual thing. I needed to get comfortable with the pressure.
                    </p>

                    <p className="font-sans-landing text-white/70 text-lg leading-relaxed mb-8">
                        I couldn&apos;t find that resource anywhere. So after I passed, I built it myself. This is the tool I wish had existed when I was preparing.&rdquo;
                    </p>

                    <div className="font-sans-landing">
                        <div className="text-white font-medium">— The Creator</div>
                        <div className="text-white/50 text-sm mt-1">Passed Inburgering 2024</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
