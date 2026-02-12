export function Features() {
    return (
        <section className="py-[70px] px-6 lg:px-10 max-w-[1200px] mx-auto reveal" id="features">
            <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-4">
                Features
            </div>
            <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-5 font-extrabold">
                Everything you need,<br className="hidden sm:block" /> nothing you don&apos;t
            </h2>
            <p className="text-[1.05rem] text-[var(--ink-soft)] leading-[1.7] max-w-[560px] mb-[36px]">
                Purpose-built for expats who believe in structured drills and want exam-day confidence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Regular feature cards */}
                {[
                    {
                        emoji: "🎯",
                        title: "Exam-identical questions",
                        description: "Every question mirrors the actual DUO exam format. Drill reading, KNM, and listening until nothing on test day surprises you.",
                    },
                    {
                        emoji: "📊",
                        title: "Readiness dashboard",
                        description: "Track your progress across all exam sections. See exactly where you stand, what to focus on, and when you're statistically ready to pass.",
                    },
                ].map((feature, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-[16px] p-10 border border-[#ebe8e0] hover:shadow-[var(--shadow-hover)] hover:border-transparent transition-all duration-300"
                    >
                        <span className="text-[1.8rem] block mb-5">{feature.emoji}</span>
                        <h3 className="text-[1.2rem] font-bold text-[var(--ink)] mb-2.5">{feature.title}</h3>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65]">{feature.description}</p>
                    </div>
                ))}

                {/* Highlight card — AI explanations */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-[var(--ink)] rounded-[16px] p-10 border border-transparent">
                    <div>
                        <span className="text-[1.8rem] block mb-5">🤖</span>
                        <h3 className="text-[1.2rem] font-bold text-white mb-2.5">AI-powered explanations</h3>
                        <p className="text-[0.92rem] text-white/70 leading-[1.65]">
                            Stuck on a question? Get an instant explanation and practical tip in English. Understand the Dutch cultural context behind each answer, not just the right letter.
                        </p>
                    </div>
                    <div className="bg-white/[0.08] rounded-[10px] p-7 flex flex-col gap-3">
                        <div className="bg-[var(--accent)] text-white px-[18px] py-3 rounded-[14px] rounded-br-[4px] text-[0.88rem] leading-[1.5] max-w-[85%] self-end">
                            Why is answer B correct? I thought Dutch people go to the huisarts first?
                        </div>
                        <div className="bg-white/[0.12] text-white/90 px-[18px] py-3 rounded-[14px] rounded-bl-[4px] text-[0.88rem] leading-[1.5] max-w-[85%] self-start">
                            Great question! In the Netherlands, the huisarts is indeed your first stop for most health issues. Answer B is correct because for emergencies you call 112, but for urgent non-emergency care, you contact the huisartsenpost (GP post)...
                        </div>
                    </div>
                </div>

                {/* More regular cards */}
                {[
                    {
                        emoji: "🇳🇱",
                        title: "KNM deep-dives",
                        description: "The Knowledge of Dutch Society section trips up most expats. Our targeted modules cover Dutch customs, government, healthcare, and daily life with real scenarios.",
                    },
                    {
                        emoji: "⚡",
                        title: "20-minute drill sessions",
                        description: "Bite-sized drill sessions designed for busy schedules. Commute, lunch break, before bed — fit a full drill into the gaps in your day.",
                    },
                ].map((feature, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-[16px] p-10 border border-[#ebe8e0] hover:shadow-[var(--shadow-hover)] hover:border-transparent transition-all duration-300"
                    >
                        <span className="text-[1.8rem] block mb-5">{feature.emoji}</span>
                        <h3 className="text-[1.2rem] font-bold text-[var(--ink)] mb-2.5">{feature.title}</h3>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65]">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
