import { EmailCapture } from "./EmailCapture";

export function LandingHero() {
    const bullets = [
        "Hundreds of questions on all exam topics",
        "Identical interface to the real DUO exam",
        "Track progress & know when you're ready",
    ];

    return (
        <main className="bg-gradient-to-b from-[var(--landing-cream)] to-[#FFF9F5]">
            <div className="max-w-7xl mx-auto px-8 pt-16 pb-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left column */}
                    <div>
                        <span className="font-sans-landing inline-block text-xs font-medium tracking-wide uppercase text-[var(--landing-orange)] bg-[var(--landing-orange)]/10 px-3 py-1.5 rounded-full mb-6 animate-reveal-delay-1">
                            Made by expats, for expats
                        </span>

                        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[var(--landing-navy)] leading-tight mb-6 animate-reveal-delay-2">
                            Exactly what you need to pass the{" "}
                            <span className="text-[var(--landing-orange)]">Inburgering Exam</span>
                        </h1>

                        <p className="font-sans-landing text-lg text-[var(--landing-navy)]/60 max-w-lg mb-8 leading-relaxed animate-reveal-delay-3">
                            Gain the confidence you need by simulating the actual test — same interface, same format, 100% useful.
                        </p>

                        <ul className="font-sans-landing space-y-3 mb-8 animate-reveal-delay-3">
                            {bullets.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[var(--landing-navy)]/80">
                                    <svg className="w-5 h-5 text-[var(--landing-green)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div id="email-capture" className="animate-reveal-delay-4">
                            <EmailCapture variant="hero" />
                        </div>
                    </div>

                    {/* Right column — static KNM practice card */}
                    <div className="hidden lg:block animate-reveal-delay-3">
                        <div className="landing-card rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[var(--landing-orange)]/10 flex items-center justify-center text-[var(--landing-orange)]">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-sans-landing font-semibold text-[var(--landing-navy)]">KNM Practice Exam</div>
                                    <div className="font-sans-landing text-xs text-[var(--landing-navy)]/50">Question 3 of 12</div>
                                </div>
                            </div>

                            <p className="font-sans-landing text-[var(--landing-navy)] mb-5 leading-relaxed">
                                Wat moet je doen als je het niet eens bent met een beslissing van de gemeente?
                            </p>

                            <div className="space-y-3">
                                {[
                                    "Naar het politiebureau gaan",
                                    "Een bezwaar indienen",
                                    "Contact opnemen met je ambassade",
                                    "Een brief schrijven aan de Koning",
                                ].map((option, i) => (
                                    <div
                                        key={i}
                                        className={`font-sans-landing text-sm px-4 py-3 rounded-xl border transition-colors ${
                                            i === 1
                                                ? "border-[var(--landing-green)] bg-[var(--landing-green)]/5 text-[var(--landing-green)]"
                                                : "border-gray-200 text-[var(--landing-navy)]/70"
                                        }`}
                                    >
                                        <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                                        {option}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
