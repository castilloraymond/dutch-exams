import { Trophy } from "lucide-react";

export function HowItWorks() {
    return (
        <section className="py-[70px] px-6 lg:px-10 bg-white reveal" id="how">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-4">
                    How it works
                </div>
                <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-5 font-extrabold">
                    Three steps to prepare
                </h2>
                <p className="text-[1.05rem] text-[var(--ink-soft)] leading-[1.7] max-w-[560px] mb-[36px]">
                    No guesswork. No wasted time. Just structured practice on the real exam format.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 [counter-reset:step]">
                    {/* Step 1 */}
                    <div className="relative [counter-increment:step] before:content-[counter(step,decimal-leading-zero)] before:text-[4rem] before:font-extrabold before:text-[var(--ink)]/[0.15] before:leading-none before:block before:mb-4 before:tracking-[-0.04em]">
                        <h3 className="text-[1.15rem] font-bold text-[var(--ink)] mb-2.5">Pick your module</h3>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65]">
                            Choose from Lezen, Luisteren, KNM, Schrijven, or Spreken. Each targets a specific section of the inburgering exam.
                        </p>
                        <div className="mt-5 bg-[var(--cream)] rounded-[10px] p-5 border border-[#ebe8e0]">
                            <div className="flex flex-wrap gap-2">
                                {["KNM", "Reading", "Listening", "Writing", "Speaking"].map((tag, i) => (
                                    <span
                                        key={tag}
                                        className={`px-3.5 py-1.5 rounded-full text-[0.78rem] font-semibold ${
                                            i < 2
                                                ? "bg-[var(--green-soft)] text-[var(--green)]"
                                                : "bg-[var(--cream-dark)] text-[var(--ink-soft)]"
                                        }`}
                                    >
                                        {tag} {i < 2 && "✓"}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative [counter-increment:step] before:content-[counter(step,decimal-leading-zero)] before:text-[4rem] before:font-extrabold before:text-[var(--ink)]/[0.15] before:leading-none before:block before:mb-4 before:tracking-[-0.04em]">
                        <h3 className="text-[1.15rem] font-bold text-[var(--ink)] mb-2.5">Practice real exam questions</h3>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65]">
                            Same question format, same time pressure, same interface as the actual computer-based DUO exam. Every question includes an explanation.
                        </p>
                        <div className="mt-5 bg-[var(--cream)] rounded-[10px] p-5 border border-[#ebe8e0]">
                            <div className="text-[0.82rem] text-[var(--ink-soft)] font-semibold mb-2">Exam readiness</div>
                            <div className="h-1.5 bg-[var(--cream-dark)] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[var(--green)] to-[#4ac07a] rounded-full w-[72%]" />
                            </div>
                            <div className="text-[0.78rem] text-[var(--ink-muted)] mt-2">72% ready — ~3 weeks to go</div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative [counter-increment:step] before:content-[counter(step,decimal-leading-zero)] before:text-[4rem] before:font-extrabold before:text-[var(--ink)]/[0.15] before:leading-none before:block before:mb-4 before:tracking-[-0.04em]">
                        <h3 className="text-[1.15rem] font-bold text-[var(--ink)] mb-2.5">Know when you&apos;re ready</h3>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65]">
                            Track your score across sessions. When you&apos;re consistently passing, stop studying and book your exam.
                        </p>
                        <div className="mt-5 bg-[var(--cream)] rounded-[10px] p-5 border border-[#ebe8e0]">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-[0.88rem] text-[var(--ink)] font-semibold leading-[1.4]">Ready for exam day</div>
                                    <div className="text-[0.8rem] text-[var(--ink-muted)]">Consistently scoring above 80%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
