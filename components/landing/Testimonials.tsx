import { Star } from "lucide-react";

/* PLACEHOLDER — all testimonials are placeholder content */
const testimonials = [
    {
        quote: "I'd been procrastinating for months. This broke it into manageable daily sessions. Passed all sections on my first attempt after 10 weeks of practice.",
        name: "Maria K.",
        role: "Product Manager · Moved from Brazil",
        avatarBg: "#3B6BCC",
        initial: "M",
    },
    {
        quote: "The KNM section was my biggest fear. The practice questions here were almost identical to what I got on exam day. The AI explanations helped me actually understand Dutch culture, not just memorize answers.",
        name: "Raj P.",
        role: "Software Engineer · Moved from India",
        avatarBg: "#2D8F5E",
        initial: "R",
    },
    {
        quote: "Worth every cent. I was paying €200/month for a classroom course that moved too slowly. Switched to this, studied on my own schedule, and passed within 3 months.",
        name: "Sophie L.",
        role: "Finance Analyst · Moved from France",
        avatarBg: "#E8632B",
        initial: "S",
    },
];

export function Testimonials() {
    return (
        <section className="py-[100px] px-6 lg:px-10 bg-white reveal" id="testimonials">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-4">
                    What expats say
                </div>
                <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-[50px] font-extrabold">
                    Passed, relieved, and recommending<br className="hidden sm:block" /> it to colleagues
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-[var(--cream)] rounded-[16px] p-8 border border-[#ebe8e0] flex flex-col"
                        >
                            <div className="flex gap-0.5 mb-[18px] text-[#F4A623]">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} className="h-4 w-4 fill-current" />
                                ))}
                            </div>
                            {/* PLACEHOLDER */}
                            <blockquote className="text-[0.95rem] text-[var(--ink-soft)] leading-[1.7] flex-1 mb-6 italic">
                                &ldquo;{t.quote}&rdquo;
                            </blockquote>
                            <div className="flex items-center gap-3 pt-5 border-t border-[#e8e5de]">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[0.85rem] text-white"
                                    style={{ background: t.avatarBg }}
                                >
                                    {t.initial}
                                </div>
                                <div>
                                    <div className="text-[0.88rem] font-semibold text-[var(--ink)] leading-[1.3]">{t.name}</div>
                                    <div className="text-[0.78rem] text-[var(--ink-muted)]">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
