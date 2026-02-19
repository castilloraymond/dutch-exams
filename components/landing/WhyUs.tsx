import Link from "next/link";
import { BookOpen, Headphones, Landmark, PenLine, MessageCircle } from "lucide-react";

const modules = [
    {
        name: "Lezen",
        label: "Reading",
        icon: <BookOpen className="h-6 w-6" />,
        iconBg: "bg-[var(--blue-soft)] text-[var(--blue)]",
        description: "Read short Dutch texts — letters, notices, ads — and answer comprehension questions.",
        href: "/learn/lezen/select",
    },
    {
        name: "Luisteren",
        label: "Listening",
        icon: <Headphones className="h-6 w-6" />,
        iconBg: "bg-[var(--green-soft)] text-[var(--green)]",
        description: "Listen to Dutch conversations and answer questions about what you heard.",
        href: "/learn/luisteren/select",
    },
    {
        name: "KNM",
        label: "Dutch Society",
        icon: <Landmark className="h-6 w-6" />,
        iconBg: "bg-[var(--accent-soft)] text-[var(--accent)]",
        description: "Questions on Dutch laws, customs, healthcare, government, and daily life.",
        href: "/learn/knm/select",
    },
    {
        name: "Schrijven",
        label: "Writing",
        icon: <PenLine className="h-6 w-6" />,
        iconBg: "bg-[var(--blue-soft)] text-[var(--blue)]",
        description: "Write short emails, fill in forms, and compose messages in Dutch.",
        href: "/learn/schrijven",
    },
    {
        name: "Spreken",
        label: "Speaking",
        icon: <MessageCircle className="h-6 w-6" />,
        iconBg: "bg-[var(--green-soft)] text-[var(--green)]",
        description: "Respond to prompts and scenarios out loud in Dutch.",
        href: "/learn/spreken",
    },
];

export function ExamModules() {
    return (
        <section className="py-[70px] px-6 lg:px-10 max-w-[1200px] mx-auto reveal" id="modules">
            <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-4">
                Exam modules
            </div>
            <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] mb-5 font-extrabold">
                What&apos;s on the exam
            </h2>
            <p className="text-[1.05rem] text-[var(--ink-soft)] leading-[1.7] max-w-[560px] mb-[36px]">
                The inburgering exam has 5 modules. We cover all of them.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((mod) => (
                    <Link
                        key={mod.name}
                        href={mod.href}
                        className="bg-white rounded-[16px] p-9 border border-[#ebe8e0] hover:shadow-[var(--shadow-hover)] hover:translate-y-[-4px] hover:border-transparent transition-all duration-300 group"
                    >
                        <div className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-5 ${mod.iconBg}`}>
                            {mod.icon}
                        </div>
                        <div className="flex items-baseline gap-2 mb-2.5">
                            <h3 className="text-[1.1rem] font-bold text-[var(--ink)]">{mod.name}</h3>
                            <span className="text-[0.82rem] text-[var(--ink-muted)]">({mod.label})</span>
                        </div>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65]">{mod.description}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
