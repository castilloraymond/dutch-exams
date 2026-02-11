import Link from "next/link";
import { Check, ShieldCheck, ArrowRight } from "lucide-react";

/* PLACEHOLDER — all pricing and features are placeholder values */
export function Pricing() {
    const features = [
        "1,200+ practice questions",
        "AI-powered explanations",
        "All exam sections covered",
        "Readiness score tracking",
        "Personalized study plan",
        "Mobile-friendly access",
    ];

    return (
        <section className="py-[100px] px-6 lg:px-10 max-w-[900px] mx-auto text-center reveal" id="pricing">
            <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-4">
                Simple pricing
            </div>
            <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-5 font-extrabold">
                One plan. Everything included.
            </h2>
            <p className="text-[1.05rem] text-[var(--ink-soft)] leading-[1.7] mx-auto mb-[50px]">
                Less than the cost of one failed exam retake.
            </p>

            <div className="bg-white rounded-[24px] p-14 border-2 border-[#ebe8e0] relative overflow-hidden">
                {/* Top gradient border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-glow)]" />

                {/* PLACEHOLDER — price */}
                <div className="text-[3.5rem] font-extrabold text-[var(--ink)] tracking-[-0.03em] mb-1">
                    €49 <span className="text-[1.2rem] text-[var(--ink-muted)] font-normal">/ 3 months</span>
                </div>
                {/* PLACEHOLDER */}
                <div className="text-[0.92rem] text-[var(--ink-muted)] mb-9">
                    That&apos;s less than €0.55 per day
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3.5 text-left max-w-[520px] mx-auto mb-10">
                    {features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-[0.92rem] text-[var(--ink-soft)]">
                            {/* PLACEHOLDER */}
                            <Check className="h-4 w-4 text-[var(--green)] shrink-0" />
                            {feature}
                        </div>
                    ))}
                </div>

                <Link
                    href="/try"
                    className="cta-primary inline-flex items-center gap-2.5 px-11 py-[18px] rounded-full font-semibold text-[1.05rem]"
                >
                    Start your free practice test
                    <ArrowRight className="h-4 w-4" />
                </Link>

                {/* PLACEHOLDER */}
                <div className="mt-6 text-[0.85rem] text-[var(--ink-muted)] flex items-center justify-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[var(--green)]" />
                    7-day money-back guarantee. No questions asked.
                </div>
            </div>
        </section>
    );
}
