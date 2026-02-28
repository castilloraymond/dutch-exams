import { X, Check } from "lucide-react";

export function IsThisForYou() {
    const notFor = [
        "Your goal is to be fluent. This tool is optimized for you to pass the test and not necessarily to help you have a conversation with a local.",
        "You are a total beginner. Mock exams assume that you already have a base level of knowledge.",
        "You want personal feedback from a teacher. This is a self-study tool — there's no tutor reviewing your answers or giving personalized corrections.",
    ];

    const isFor = [
        "You have a busy schedule but need to prepare for the Inburgering exam.",
        "You already have a basic grasp of Dutch vocabulary and grammar.",
        "You prefer a product solution over part-time classes.",
        "You want to pass the test on your first try.",
    ];

    return (
        <section className="py-8 sm:py-[70px] px-6 lg:px-10 max-w-[1200px] mx-auto bg-white reveal">
            <div className="text-center mb-6 sm:mb-12">
                <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-4">
                    Is this for you?
                </div>
                <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] font-extrabold">
                    Built for busy professionals, not beginners
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-[900px] mx-auto">
                {/* NOT for you column */}
                <div className="rounded-[16px] border border-[#ebe8e0] p-5 sm:p-8">
                    <h3 className="text-[1rem] font-bold text-red-400 uppercase tracking-[0.04em] mb-6">
                        This is NOT for you if&hellip;
                    </h3>
                    <div className="space-y-4">
                        {notFor.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 text-[0.95rem] text-[var(--ink-soft)] leading-[1.65]">
                                <X className="h-5 w-5 text-[var(--ink-muted)] shrink-0 mt-0.5" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* IS for you column */}
                <div className="rounded-[16px] border-2 border-[var(--green)] bg-[var(--green-soft)] p-5 sm:p-8">
                    <h3 className="text-[1rem] font-bold text-[var(--green)] uppercase tracking-[0.04em] mb-6">
                        This IS for you if&hellip;
                    </h3>
                    <div className="space-y-4">
                        {isFor.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 text-[0.95rem] text-[var(--ink)] leading-[1.65]">
                                <Check className="h-5 w-5 text-[var(--green)] shrink-0 mt-0.5" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
