import type { Metadata } from "next";
import {
  LandingNav,
  LandingHero,
  TrustBar,
  ProblemSection,
  IsThisForYou,
  HowItWorks,
  ExamModules,
  FAQ,
  BlogPreview,
  FinalCTA,
  LandingFooter,
  ScrollRevealInit,
} from "@/components/landing";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "passinburgering | Pass Your Dutch Inburgering Exam First Try",
  description:
    "Practice exams for all 5 Dutch inburgering modules — Lezen, Luisteren, KNM, Schrijven & Spreken. Realistic computer-based simulations, built by expats for expats.",
  alternates: {
    canonical: "https://passinburgering.com",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--cream)] overflow-x-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Dutch Inburgering Exam Practice",
          description:
            "Practice exams covering all 5 modules of the Dutch civic integration exam: Reading (Lezen), Listening (Luisteren), Dutch Society (KNM), Writing (Schrijven), and Speaking (Spreken).",
          provider: {
            "@type": "Organization",
            name: "passinburgering",
            url: "https://passinburgering.com",
          },
          educationalLevel: "A1-B1",
          inLanguage: ["nl", "en"],
          numberOfCredits: 71,
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "online",
            courseWorkload: "PT20H",
          },
        }}
      />
      <ScrollRevealInit />
      <div className="hidden sm:block py-1.5 sm:py-2 px-4 text-center text-xs sm:text-sm font-medium text-white bg-[var(--accent)]">
        ✨ Start practicing for free — no signup required
      </div>
      <LandingNav />
      <LandingHero />
      <TrustBar />
      <ProblemSection />
      <IsThisForYou />
      <HowItWorks />
      <ExamModules />
      <FAQ />
      <BlogPreview />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
