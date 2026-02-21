import { Star } from "lucide-react";

const testimonials = [
    {
        quote: "I'd been procrastinating for months. This broke it into 20-minute drill sessions I could actually stick to. I drilled every question type until nothing surprised me. Passed all sections first try.",
        name: "Maria K.",
        role: "Product Manager · Moved from Brazil",
        avatarBg: "#3B6BCC",
        initial: "M",
    },
    {
        quote: "The KNM section was my biggest fear. I treated this like SAT prep — drill after drill, reviewing the tips after every question. The real exam felt like just another practice run.",
        name: "Raj P.",
        role: "Software Engineer · Moved from India",
        avatarBg: "#2D8F5E",
        initial: "R",
    },
    {
        quote: "I was paying €200/month for a classroom course that moved too slowly. Switched to this, drilled at my own pace, and the practical tips taught me more than my textbook ever did. Passed within 3 months.",
        name: "Sophie L.",
        role: "Finance Analyst · Moved from France",
        avatarBg: "#E8632B",
        initial: "S",
    },
];

export function Testimonials() {
    return (
        <section className="py-12 sm:py-[70px] px-5 sm:px-6 lg:px-10 bg-white reveal" id="testimonials">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-[0.78rem] sm:text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-3 sm:mb-4">
                    What expats say
                </div>
                <h2 className="text-[1.7rem] sm:text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-6 sm:mb-[36px] font-extrabold">
                    Passed, relieved, and recommending<br className="hidden sm:block" /> it to colleagues
                </h2>

                {/* Mobile: horizontal scroll / Desktop: grid */}
                <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none -mx-5 px-5 sm:mx-0 sm:px-0 pb-2 sm:pb-0 scrollbar-none">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-[var(--cream)] rounded-[16px] p-6 sm:p-8 border border-[#ebe8e0] flex flex-col min-w-[280px] sm:min-w-0 snap-start shrink-0 sm:shrink"
                        >
                            <div className="flex gap-0.5 mb-3 sm:mb-[18px] text-[#F4A623]">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />
                                ))}
                            </div>
                            <blockquote className="text-[0.88rem] sm:text-[0.95rem] text-[var(--ink-soft)] leading-[1.65] sm:leading-[1.7] flex-1 mb-5 sm:mb-6 italic">
                                &ldquo;{t.quote}&rdquo;
                            </blockquote>
                            <div className="flex items-center gap-3 pt-4 sm:pt-5 border-t border-[#e8e5de]">
                                <div
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-[0.82rem] sm:text-[0.85rem] text-white"
                                    style={{ background: t.avatarBg }}
                                >
                                    {t.initial}
                                </div>
                                <div>
                                    <div className="text-[0.85rem] sm:text-[0.88rem] font-semibold text-[var(--ink)] leading-[1.3]">{t.name}</div>
                                    <div className="text-[0.75rem] sm:text-[0.78rem] text-[var(--ink-muted)]">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
