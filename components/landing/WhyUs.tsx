import Link from "next/link";
import { BookOpen, Headphones, Landmark, PenLine, MessageCircle, ArrowRight } from "lucide-react";

const modules = [
    {
        name: "Lezen",
        label: "Reading",
        icon: <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />,
        iconBg: "bg-[var(--blue-soft)] text-[var(--blue)]",
        description: "Read short Dutch texts — letters, notices, ads — and answer comprehension questions.",
        href: "/learn/lezen/select",
    },
    {
        name: "Luisteren",
        label: "Listening",
        icon: <Headphones className="h-5 w-5 sm:h-6 sm:w-6" />,
        iconBg: "bg-[var(--green-soft)] text-[var(--green)]",
        description: "Listen to Dutch conversations and answer questions about what you heard.",
        href: "/learn/luisteren/select",
    },
    {
        name: "KNM",
        label: "Dutch Society",
        icon: <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />,
        iconBg: "bg-[var(--accent-soft)] text-[var(--accent)]",
        description: "Questions on Dutch laws, customs, healthcare, government, and daily life.",
        href: "/learn/knm/select",
    },
    {
        name: "Schrijven",
        label: "Writing",
        icon: <PenLine className="h-5 w-5 sm:h-6 sm:w-6" />,
        iconBg: "bg-[var(--blue-soft)] text-[var(--blue)]",
        description: "Write short emails, fill in forms, and compose messages in Dutch.",
        href: "/learn/schrijven",
    },
    {
        name: "Spreken",
        label: "Speaking",
        icon: <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />,
        iconBg: "bg-[var(--green-soft)] text-[var(--green)]",
        description: "Respond to prompts and scenarios out loud in Dutch.",
        href: "/learn/spreken",
    },
];

export function ExamModules() {
    return (
        <section className="py-12 sm:py-[70px] px-5 sm:px-6 lg:px-10 max-w-[1200px] mx-auto reveal" id="modules">
            <div className="text-[0.78rem] sm:text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-3 sm:mb-4">
                Exam modules
            </div>
            <h2 className="text-[1.7rem] sm:text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-4 sm:mb-5 font-extrabold">
                What&apos;s on the exam
            </h2>
            <p className="text-[0.95rem] sm:text-[1.05rem] text-[var(--ink-soft)] leading-[1.6] sm:leading-[1.7] max-w-[560px] mb-6 sm:mb-[36px]">
                The inburgering exam has 5 modules. We cover all of them.
            </p>

            {/* Mobile: horizontal scroll / Desktop: grid */}
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none -mx-5 px-5 sm:mx-0 sm:px-0 pb-2 sm:pb-0 scrollbar-none">
                {modules.map((mod) => (
                    <Link
                        key={mod.name}
                        href={mod.href}
                        className="bg-white rounded-[16px] p-6 sm:p-9 border border-[#ebe8e0] hover:shadow-[var(--shadow-hover)] hover:translate-y-[-4px] hover:border-transparent transition-all duration-300 group min-w-[240px] sm:min-w-0 snap-start shrink-0 sm:shrink"
                    >
                        <div className={`w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl sm:rounded-[14px] flex items-center justify-center mb-4 sm:mb-5 ${mod.iconBg}`}>
                            {mod.icon}
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <h3 className="text-[1rem] sm:text-[1.1rem] font-bold text-[var(--ink)]">{mod.name}</h3>
                            <span className="text-[0.78rem] sm:text-[0.82rem] text-[var(--ink-muted)]">({mod.label})</span>
                        </div>
                        <p className="text-[0.85rem] sm:text-[0.92rem] text-[var(--ink-soft)] leading-[1.6] sm:leading-[1.65] mb-3 sm:mb-0">{mod.description}</p>
                        <div className="sm:hidden flex items-center gap-1 text-[0.82rem] font-medium text-[var(--accent)]">
                            Practice <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
