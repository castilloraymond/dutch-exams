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
    "Free practice exams for all 5 Dutch inburgering modules — Lezen, Luisteren, KNM, Schrijven & Spreken. Realistic computer-based simulations, built by expats for expats.",
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
            "Free practice exams covering all 5 modules of the Dutch civic integration exam: Reading (Lezen), Listening (Luisteren), Dutch Society (KNM), Writing (Schrijven), and Speaking (Spreken).",
          provider: {
            "@type": "Organization",
            name: "passinburgering",
            url: "https://passinburgering.com",
          },
          isAccessibleForFree: true,
          educationalLevel: "A1-B1",
          inLanguage: ["nl", "en"],
          numberOfCredits: 46,
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "online",
            courseWorkload: "PT20H",
          },
        }}
      />
      <ScrollRevealInit />
      <div className="py-2 px-4 text-center text-sm font-medium text-white bg-[var(--accent)]">
        ✨ Free during beta — no payment required. Pricing may apply once new features launch.
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
