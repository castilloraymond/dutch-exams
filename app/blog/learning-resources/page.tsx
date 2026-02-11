import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Best Free Resources to Learn Dutch for Inburgering (2026)",
  description:
    "A curated list of the best free and paid resources to learn Dutch and prepare for the inburgering exam. Apps, websites, practice exams, and community tips.",
  alternates: {
    canonical: "https://passinburgering.com/blog/learning-resources",
  },
};

const FREE_RESOURCES = [
  {
    name: "Duolingo",
    url: "https://www.duolingo.com/course/nl/en/Learn-Dutch",
    description:
      "The most popular free language app. Great for building vocabulary and basic grammar through bite-sized daily lessons. The Dutch course is well-developed with a strong community. Good starting point, but not enough on its own for inburgering.",
    tags: ["App", "Free"],
  },
  {
    name: "NT2 Oefening",
    url: "https://nt2oefening.nl/en/",
    description:
      "Purpose-built for inburgering exam preparation. Practice exercises that closely match the official exam format for reading, listening, writing, and KNM. One of the best free resources for exam-specific practice.",
    tags: ["Website", "Free", "Exam Practice"],
  },
  {
    name: "Official DUO Practice Exams",
    url: "https://www.inburgeren.nl/en/taking-the-integration-exam/practicing.jsp",
    description:
      "Free practice exams published by DUO (the official exam body). Available for all modules at A2, B1, and B2 levels. These are the closest you can get to the real exam format. Download the PDFs and audio files directly.",
    tags: ["Official", "Free", "Exam Practice"],
  },
  {
    name: "NT2 TaalMenu",
    url: "https://nt2taalmenu.nl/learn-dutch-with-nt2taalmenu/",
    description:
      "Exercises for all levels from beginner to B2. Practice for both the inburgeringsexamen and the Staatsexamen. Well-organized by skill and level.",
    tags: ["Website", "Free"],
  },
  {
    name: "DutchGrammar.com",
    url: "https://www.dutchgrammar.com/",
    description:
      "Thousands of articles on Dutch grammar and spelling rules, with audio snippets and a helpful forum. The forum has a dedicated section for inburgering and NT2 exam questions where you can ask for help.",
    tags: ["Website", "Free", "Grammar"],
  },
  {
    name: "Oefenen.nl",
    url: "https://oefenen.nl/",
    description:
      "Fun, interactive language exercises under the \"Taal\" section. Free with account registration. Good for supplementary practice alongside more structured study materials.",
    tags: ["Website", "Free"],
  },
  {
    name: "Clozemaster",
    url: "https://www.clozemaster.com/",
    description:
      "Learn Dutch vocabulary in context through fill-in-the-blank sentences. Gamified approach that helps you pick up words naturally. Great supplement to grammar-focused study.",
    tags: ["App", "Free"],
  },
  {
    name: "NetInNederland (NPO)",
    url: "https://www.netinnederland.nl/",
    description:
      "Videos and TV programmes from the Dutch public broadcaster with subtitles in Dutch, English, and Arabic. Excellent for listening practice and learning about Dutch culture at the same time.",
    tags: ["Website", "Free", "Video"],
  },
];

const PAID_RESOURCES = [
  {
    name: "Babbel",
    url: "https://www.babbel.com/learn-dutch",
    description:
      "Structured Dutch courses from A1 to A2. More focused on conversation and real-life scenarios than Duolingo. Good for beginners who want a clear learning path.",
    price: "~\u20AC10/month",
  },
  {
    name: "InburgeringOnline",
    url: "https://www.inburgeringonline.nl/en/a2",
    description:
      "Dedicated platform for inburgering exam preparation at A2 level. Includes lessons and practice exams tailored specifically to the Dutch civic integration exam.",
    price: "Varies",
  },
  {
    name: "DutchPod101",
    url: "https://www.dutchpod101.com/",
    description:
      "Audio and video lessons covering Dutch from beginner to advanced. Podcast-style format is great for learning during commutes. Includes vocabulary lists and grammar notes.",
    price: "Free trial, then ~\u20AC8/month",
  },
];

const COMMUNITY_RESOURCES = [
  {
    name: "Library Taalcaf\u00E9s",
    description:
      "Many Dutch public libraries host free taalcaf\u00E9s (language caf\u00E9s) where you can practice speaking Dutch with volunteers and other learners. Check your local library's website or ask at the desk. This is one of the best ways to build speaking confidence.",
  },
  {
    name: "r/learndutch (Reddit)",
    url: "https://www.reddit.com/r/learndutch/",
    description:
      "Active community of Dutch learners sharing tips, resources, and answering questions. Search for \"inburgering\" to find exam-specific threads with first-hand experience reports.",
  },
  {
    name: "DutchGrammar Forum",
    url: "https://www.dutchgrammar.com/forum/viewforum.php?f=51",
    description:
      "Dedicated NT2 and inburgering section where you can ask specific questions about exam content, grammar, and study strategies.",
  },
];

export default function LearningResourcesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline:
            "Best Free Resources to Learn Dutch for the Inburgering Exam (2026)",
          description:
            "A curated list of the best free and paid resources to learn Dutch and prepare for the inburgering exam.",
          author: {
            "@type": "Organization",
            name: "passinburgering",
          },
          publisher: {
            "@type": "Organization",
            name: "passinburgering",
            url: "https://passinburgering.com",
          },
          inLanguage: "en",
        }}
      />

      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-[var(--ink)]">
              Learning Resources
            </h1>
          </div>
        </div>
      </header>

      <article className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--ink)] mb-2">
            Best Free Resources to Learn Dutch for the Inburgering Exam
          </h2>
          <p className="text-[var(--ink)]/50 mb-4">
            Updated for 2026
          </p>
          <p className="text-[var(--ink)]/70 leading-relaxed mb-8">
            Preparing for the inburgering exam doesn&apos;t have to be expensive. Whether
            you are just starting to learn Dutch or you&apos;re almost exam-ready, these
            resources will help you get there. We&apos;ve organized them by type so you can
            build a study plan that works for you.
          </p>

          {/* Quick tip */}
          <div className="landing-card p-6 mb-10 border-l-4 border-[var(--accent)]">
            <p className="text-[var(--ink)]/70 leading-relaxed">
              <strong className="text-[var(--ink)]">Study tip:</strong> Most
              people who pass the inburgering exam on their first attempt use 3&ndash;4
              resources together: a daily app like Duolingo for vocabulary, a grammar
              reference, exam-specific practice, and real-world listening. Aim for
              4&ndash;6 hours per week for 3&ndash;5 months at A2 level.
            </p>
          </div>

          {/* Table of contents */}
          <nav className="landing-card p-6 mb-10">
            <h3 className="font-semibold text-[var(--ink)] mb-3">
              In this guide
            </h3>
            <ul className="space-y-2 text-[var(--accent)]">
              <li>
                <a href="#free-resources" className="hover:underline">
                  Free resources &amp; apps
                </a>
              </li>
              <li>
                <a href="#paid-resources" className="hover:underline">
                  Paid courses
                </a>
              </li>
              <li>
                <a href="#community" className="hover:underline">
                  Community &amp; speaking practice
                </a>
              </li>
              <li>
                <a href="#study-plan" className="hover:underline">
                  Suggested study plan
                </a>
              </li>
              <li>
                <a href="#test-yourself" className="hover:underline">
                  Test yourself
                </a>
              </li>
            </ul>
          </nav>

          {/* Free Resources */}
          <section id="free-resources" className="mb-10">
            <h3 className="text-2xl font-semibold text-[var(--ink)] mb-4">
              Free resources &amp; apps
            </h3>
            <p className="text-[var(--ink)]/70 leading-relaxed mb-6">
              These are the best free tools for learning Dutch and preparing for
              the exam. You can pass the inburgering exam using only free resources
              if you are consistent with your study.
            </p>
            <div className="space-y-4">
              {FREE_RESOURCES.map((resource) => (
                <div key={resource.name} className="landing-card p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-semibold text-[var(--ink)] text-lg">
                      {resource.name}
                    </h4>
                    <div className="flex gap-2 flex-shrink-0">
                      {resource.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-[var(--ink)]/5 text-[var(--ink)]/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[var(--ink)]/70 leading-relaxed text-sm mb-3">
                    {resource.description}
                  </p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--accent)] font-medium text-sm hover:underline"
                  >
                    Visit {resource.name}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Paid Resources */}
          <section id="paid-resources" className="mb-10">
            <h3 className="text-2xl font-semibold text-[var(--ink)] mb-4">
              Paid courses
            </h3>
            <p className="text-[var(--ink)]/70 leading-relaxed mb-6">
              These paid platforms offer more structured learning paths. They are
              not required to pass, but can help if you prefer a guided approach.
            </p>
            <div className="space-y-4">
              {PAID_RESOURCES.map((resource) => (
                <div key={resource.name} className="landing-card p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-semibold text-[var(--ink)] text-lg">
                      {resource.name}
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex-shrink-0">
                      {resource.price}
                    </span>
                  </div>
                  <p className="text-[var(--ink)]/70 leading-relaxed text-sm mb-3">
                    {resource.description}
                  </p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--accent)] font-medium text-sm hover:underline"
                  >
                    Visit {resource.name}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Community */}
          <section id="community" className="mb-10">
            <h3 className="text-2xl font-semibold text-[var(--ink)] mb-4">
              Community &amp; speaking practice
            </h3>
            <p className="text-[var(--ink)]/70 leading-relaxed mb-6">
              Learning Dutch is not just about apps and books. Speaking with real
              people and connecting with other learners will accelerate your progress
              and help with the Spreken (speaking) module.
            </p>
            <div className="space-y-4">
              {COMMUNITY_RESOURCES.map((resource) => (
                <div key={resource.name} className="landing-card p-5">
                  <h4 className="font-semibold text-[var(--ink)] text-lg mb-2">
                    {resource.name}
                  </h4>
                  <p className="text-[var(--ink)]/70 leading-relaxed text-sm mb-3">
                    {resource.description}
                  </p>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--accent)] font-medium text-sm hover:underline"
                    >
                      Visit {resource.name}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Suggested Study Plan */}
          <section id="study-plan" className="mb-10">
            <h3 className="text-2xl font-semibold text-[var(--ink)] mb-4">
              Suggested study plan
            </h3>
            <div className="space-y-4 text-[var(--ink)]/70 leading-relaxed">
              <p>
                Based on what people who passed on their first attempt recommend,
                here is a practical weekly study plan for A2 level preparation:
              </p>
              <div className="landing-card p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-[var(--ink)] min-w-[100px] flex-shrink-0">
                      Daily
                    </span>
                    <span>
                      15&ndash;20 min Duolingo or Clozemaster for vocabulary
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-[var(--ink)] min-w-[100px] flex-shrink-0">
                      2&times;/week
                    </span>
                    <span>
                      30 min grammar study on DutchGrammar.com
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-[var(--ink)] min-w-[100px] flex-shrink-0">
                      2&times;/week
                    </span>
                    <span>
                      Practice exam exercises on NT2 Oefening or passinburgering
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-[var(--ink)] min-w-[100px] flex-shrink-0">
                      1&times;/week
                    </span>
                    <span>
                      Watch a Dutch video on NetInNederland with subtitles
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-[var(--ink)] min-w-[100px] flex-shrink-0">
                      1&times;/week
                    </span>
                    <span>
                      Visit a taalcaf&eacute; or practice speaking with a friend
                    </span>
                  </li>
                </ul>
              </div>
              <p>
                At this pace (about 5 hours/week), most people reach A2 level in
                3&ndash;5 months. Start taking full practice exams 4&ndash;6 weeks
                before your exam date. When you consistently score above 80% on
                practice tests, you are ready.
              </p>
            </div>
          </section>

          {/* Test Yourself CTA */}
          <section id="test-yourself" className="mb-10">
            <div className="landing-card p-8 text-center">
              <h3 className="text-2xl font-semibold text-[var(--ink)] mb-3">
                Ready to test yourself?
              </h3>
              <p className="text-[var(--ink)]/60 mb-6 max-w-lg mx-auto">
                Take our free practice exam to see where you stand. No account
                required. When you feel ready, come back for full mock exams across
                all 5 modules.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/try"
                  className="cta-primary px-8 py-3 text-white rounded-lg font-medium"
                >
                  Take Free Assessment
                </Link>
                <Link
                  href="/guide"
                  className="px-8 py-3 border border-[var(--ink)]/20 text-[var(--ink)] rounded-lg font-medium hover:bg-[var(--ink)]/5 transition-colors"
                >
                  Read the Exam Guide
                </Link>
              </div>
            </div>
          </section>
        </div>
      </article>

      <LandingFooter />
    </main>
  );
}
