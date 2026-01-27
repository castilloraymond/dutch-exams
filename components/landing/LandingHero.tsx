import Link from "next/link";
import { EmailCapture } from "./EmailCapture";

export function LandingHero() {
    return (
        <main className="bg-gradient-to-b from-[var(--landing-cream)] to-[#FFF9F5]">
            <div className="max-w-4xl mx-auto px-8 pt-16 pb-20 text-center">
                {/* Headline */}
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--landing-navy)] leading-tight mb-6 animate-reveal-delay-2">
                    The Fastest Path to<br />
                    <span className="text-[var(--landing-orange)]">Passing Your Inburgering</span>
                </h1>

                {/* Subheadline */}
                <p className="font-sans-landing text-lg text-[var(--landing-navy)]/60 max-w-xl mx-auto mb-10 leading-relaxed animate-reveal-delay-3">
                    Skip the courses. Practice with realistic exam simulations on a computer—exactly like the real test. Built by expats, for expats.
                </p>

                {/* Email Capture */}
                <div className="animate-reveal-delay-4">
                    <EmailCapture variant="hero" />
                </div>
            </div>
        </main>
    );
}
