export function TrustBar() {
    const stats = [
        { value: "50+", label: "Mock exams" },
        { value: "1,000+", label: "Practice questions" },
        { value: "All 5", label: "Topics covered in the test" },
        { value: "Totally Free", label: "During beta" },
    ];

    return (
        <section className="hidden sm:block py-6 sm:py-[40px] px-6 lg:px-10 max-w-[1200px] mx-auto text-center reveal">
            <div className="text-[0.82rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-7 hidden sm:block">
                What&apos;s inside
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 sm:flex sm:justify-center sm:gap-[60px]">
                {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-[1.6rem] sm:text-[2.4rem] font-extrabold text-[var(--ink)] tracking-[-0.03em]">
                            {stat.value}
                        </div>
                        <div className="text-[0.85rem] text-[var(--ink-muted)] mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
