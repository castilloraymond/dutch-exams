export function TrustBar() {
    const stats = [
        { value: "1,000+", label: "Practice questions" },
        { value: "46", label: "Mock exams" },
        { value: "5", label: "Exam modules" },
        { value: "Free", label: "During beta" },
    ];

    return (
        <section className="py-6 sm:py-[40px] px-5 sm:px-6 lg:px-10 max-w-[1200px] mx-auto text-center reveal">
            <div className="text-[0.78rem] sm:text-[0.82rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-5 sm:mb-7">
                What&apos;s inside
            </div>
            <div className="grid grid-cols-2 sm:flex sm:justify-center gap-3 sm:gap-[60px]">
                {stats.map((stat, i) => (
                    <div key={i} className="sm:flex sm:items-center sm:gap-[60px]">
                        <div className="text-center bg-white sm:bg-transparent rounded-2xl sm:rounded-none p-4 sm:p-0 border border-[#ebe8e0] sm:border-0">
                            <div className="text-[1.5rem] sm:text-[2.4rem] font-extrabold text-[var(--ink)] tracking-[-0.03em]">
                                {stat.value}
                            </div>
                            <div className="text-[0.75rem] sm:text-[0.85rem] text-[var(--ink-muted)] mt-0.5 sm:mt-1">{stat.label}</div>
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
