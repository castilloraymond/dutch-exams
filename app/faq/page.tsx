import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Inburgering Exam FAQ — Your Questions Answered",
  description:
    "Frequently asked questions about the Dutch inburgering exam: cost, registration, exemptions, retake policy, exam format, and how to prepare. Veelgestelde vragen over het inburgeringsexamen.",
  alternates: {
    canonical: "https://passinburgering.com/faq",
  },
};

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is the Dutch inburgering exam?",
    answer:
      "The inburgering exam (inburgeringsexamen) is the Dutch civic integration exam that most non-EU immigrants must pass to obtain a permanent residence permit or Dutch citizenship. It tests your knowledge of the Dutch language and Dutch society across multiple modules.",
  },
  {
    question: "Wat is het inburgeringsexamen?",
    answer:
      "Het inburgeringsexamen is een verplicht examen voor de meeste niet-EU immigranten in Nederland. Het examen test je kennis van de Nederlandse taal en de Nederlandse samenleving.",
  },
  {
    question: "Who needs to take the inburgering exam?",
    answer:
      "Most non-EU/EEA nationals aged 18-67 who want to live permanently in the Netherlands must pass the inburgering exam. This includes people who come to the Netherlands for family reunification, asylum seekers who receive a residence permit, and religious leaders. Some groups are exempt, including EU/EEA citizens, people with Dutch education diplomas, and those who have lived in the Netherlands for 8+ years.",
  },
  {
    question: "How much does the inburgering exam cost?",
    answer:
      "Each exam module costs between approximately \u20ac40 and \u20ac50 at DUO. You pay per module per attempt. If you need to retake a module, you pay the full fee again. The total cost for all modules in one attempt is roughly \u20ac290. Check the DUO website for current pricing as fees may change.",
  },
  {
    question: "What are the 5 modules of the inburgering exam?",
    answer:
      "The exam consists of: (1) Lezen (Reading) \u2014 reading comprehension of Dutch texts, (2) Luisteren (Listening) \u2014 understanding spoken Dutch, (3) KNM (Kennis van de Nederlandse Maatschappij) \u2014 knowledge of Dutch society, (4) Schrijven (Writing) \u2014 writing emails, messages, and forms in Dutch, and (5) Spreken (Speaking) \u2014 speaking Dutch in everyday situations. Some people also need to complete the ONA (Ori\u00ebntatie op de Nederlandse Arbeidsmarkt) module.",
  },
  {
    question: "How do I register for the inburgering exam?",
    answer:
      "You register for the exam through DUO (Dienst Uitvoering Onderwijs) at inburgeren.nl. You need a DigiD to log in and schedule your exam. You can choose your exam date and location. Exams are held at various locations throughout the Netherlands.",
  },
  {
    question: "What is the passing score for the inburgering exam?",
    answer:
      "For the multiple-choice modules (Lezen, Luisteren, KNM), you typically need to answer at least 60% of questions correctly to pass. The Schrijven and Spreken modules are graded on a different scale based on CEFR language levels \u2014 you need to demonstrate at least A2 level proficiency.",
  },
  {
    question: "Can I retake the inburgering exam if I fail?",
    answer:
      "Yes, you can retake any module as many times as needed. Each retake requires a new registration and payment through DUO. There is no waiting period between attempts, though available exam dates may be limited depending on your location.",
  },
  {
    question: "How long do I have to pass the inburgering exam?",
    answer:
      "Under the new Civic Integration Act (Wi2021), most newcomers have 3 years to pass all exam components. Your municipality will set your specific deadline in your Personal Integration and Participation Plan (PIP). Extensions may be possible in certain circumstances.",
  },
  {
    question: "What is the KNM exam about?",
    answer:
      "The KNM (Kennis van de Nederlandse Maatschappij) exam tests your knowledge of Dutch society. Topics include: work and income, housing, health and healthcare, Dutch history, education, Dutch norms and values, politics and government, and geography. The exam is 45 minutes with 40 multiple-choice questions.",
  },
  {
    question: "Is the inburgering exam taken on a computer?",
    answer:
      "Yes, the Lezen, Luisteren, and KNM modules are taken on a computer at an exam location. The Schrijven module also uses a computer \u2014 you type your answers. The Spreken module uses a computer to play prompts, and your spoken answers are recorded via headset. This is why practicing on a computer is so important.",
  },
  {
    question: "What is vrijstelling (exemption) from the inburgering exam?",
    answer:
      "Certain groups are exempt (vrijgesteld) from the inburgering requirement. This includes: EU/EEA/Swiss citizens, people who completed Dutch education (MBO-2 or higher), Turkish nationals (under the Association Agreement), people aged 67+, and those who have had a Dutch residence permit for 8+ uninterrupted years. You can apply for exemption through DUO.",
  },
  {
    question: "What is the ONA (Ori\u00ebntatie op de Nederlandse Arbeidsmarkt)?",
    answer:
      "The ONA is a module about orientation on the Dutch labor market. It involves creating a portfolio showing you understand how to find work in the Netherlands. Not everyone needs to complete the ONA \u2014 it depends on your integration pathway (B1 route, education route, or Z-route). Check with your municipality about your specific requirements.",
  },
  {
    question: "How long should I study for the inburgering exam?",
    answer:
      "Study time varies based on your starting level. If you are already at A1 level, 2\u20134 weeks of focused practice may be enough for each module. If you are starting from scratch, most people need 6\u201312 months of regular study, including language courses. We recommend taking practice exams until you consistently score above 80%.",
  },
  {
    question: "Can I take the exam in English?",
    answer:
      "No, the entire exam is in Dutch. However, the KNM module questions are somewhat simpler in language since it tests knowledge rather than language ability. Some study materials (including passinburgering) provide English translations and explanations alongside Dutch content to help you prepare.",
  },
  {
    question: "What happens if I don\u2019t pass within the deadline?",
    answer:
      "If you don\u2019t pass within your deadline, your municipality may impose a fine or reduce your social assistance benefits. In serious cases, it could affect your residence permit. However, extensions and alternative pathways may be available \u2014 contact your municipality to discuss your options before the deadline passes.",
  },
  {
    question: "How is passinburgering different from other study tools?",
    answer:
      "passinburgering is specifically designed to simulate the real computer-based DUO exam experience. Our practice interface mimics the actual test layout, timing, and question types. We cover all 5 modules (Lezen, Luisteren, KNM, Schrijven, Spreken) with instant feedback and progress tracking. It is free to try, and built by expats who understand what you need.",
  },
  {
    question: "Is passinburgering free?",
    answer:
      "You can try sample questions from all 5 modules for free, with no account required. Take the quick assessment to see where you stand. Full access to all practice exams, mock exams, and detailed explanations is available with a subscription.",
  },
  {
    question: "I'm a kennismigrant / 30% ruling holder. Do I need to inburger?",
    answer:
      "No — the 30% ruling exempts you from mandatory inburgering. However, if you want permanent residence (verblijfsvergunning onbepaalde tijd) or Dutch citizenship (naturalisatie), you will need to pass the inburgering exams at A2 level under the Wi2013 framework. Many kennismigranten choose to prepare voluntarily so they're ready when the time comes.",
  },
  {
    question: "What changed about the KNM exam in July 2025?",
    answer:
      "The KNM exam was overhauled in July 2025 with updated topics, new question formats, and revised content reflecting recent changes in Dutch society. Our practice materials are updated to cover the new format so you're not studying outdated material.",
  },
  {
    question: "What changed about the Spreken exam in March 2025?",
    answer:
      "The Spreken (Speaking) exam format changed in March 2025 with adjusted prompts and evaluation criteria. Our speaking practice exercises reflect the new format, including the updated task types and assessment standards.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
      <JsonLd data={faqSchema} />

      <header className="border-b border-[var(--landing-navy)]/10 sticky top-0 bg-[var(--landing-cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[var(--landing-navy)]/60 hover:text-[var(--landing-navy)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold font-sans-landing text-[var(--landing-navy)]">
              Inburgering Exam FAQ
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--landing-navy)] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-sans-landing text-[var(--landing-navy)]/60 mb-10 text-lg">
            Everything you need to know about the Dutch inburgering exam &mdash;
            from registration to results.
          </p>

          <div className="space-y-6">
            {faqItems.map((item, i) => (
              <div key={i} className="landing-card p-6">
                <h3 className="font-sans-landing font-semibold text-[var(--landing-navy)] text-lg mb-3">
                  {item.question}
                </h3>
                <p className="font-sans-landing text-[var(--landing-navy)]/70 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="font-sans-landing text-[var(--landing-navy)]/60 mb-4">
              Ready to start practicing?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/try"
                className="cta-primary px-8 py-3 text-white rounded-lg font-medium text-center"
              >
                Take Free Assessment
              </Link>
              <Link
                href="/learn"
                className="px-8 py-3 border border-[var(--landing-navy)]/20 text-[var(--landing-navy)] rounded-lg font-medium text-center hover:bg-[var(--landing-navy)]/5 transition-colors"
              >
                Browse Practice Exams
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
