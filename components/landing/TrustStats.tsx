export function TrustBar() {
    const stats = [
        { value: "1,000+", label: "Practice questions" },
        { value: "46", label: "Mock exams" },
        { value: "All 5", label: "Topics covered in the test" },
        { value: "Totally Free", label: "During beta" },
    ];

    return (
        <section className="py-[40px] px-6 lg:px-10 max-w-[1200px] mx-auto text-center reveal">
            <div className="text-[0.82rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-7">
                What&apos;s inside
            </div>
            <div className="flex justify-center gap-[60px] flex-wrap">
                {stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-[60px]">
                        <div className="text-center">
                            <div className="text-[2.4rem] font-extrabold text-[var(--ink)] tracking-[-0.03em]">
                                {stat.value}
                            </div>
                            <div className="text-[0.85rem] text-[var(--ink-muted)] mt-1">{stat.label}</div>
                        </div>
                        {i < stats.length - 1 && (
                            <div className="w-px self-stretch bg-[#e0ddd6] hidden sm:block" />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
