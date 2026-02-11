import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "The Complete Guide to the Dutch Inburgering Exam (2026)",
  description:
    "Everything you need to know about the Dutch inburgering exam: who needs it, 5 modules explained, registration at DUO, scoring, preparation tips, and exemptions. Updated for 2026.",
  alternates: {
    canonical: "https://passinburgering.com/guide",
  },
};

export default function GuidePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "The Complete Guide to the Dutch Inburgering Exam (2026)",
          description:
            "A comprehensive guide to the Dutch civic integration exam covering all 5 modules, registration, scoring, and preparation tips.",
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
              href="/"
              className="text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-[var(--ink)]">
              Exam Guide
            </h1>
          </div>
        </div>
      </header>

      <article className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--ink)] mb-2">
            The Complete Guide to the Dutch Inburgering Exam
          </h2>
          <p className="text-[var(--ink)]/50 mb-8">
            Updated for 2026
          </p>

          {/* Table of contents */}
          <nav className="landing-card p-6 mb-10">
            <h3 className="font-semibold text-[var(--ink)] mb-3">
              In this guide
            </h3>
            <ul className="space-y-2 text-[var(--accent)]">
              <li><a href="#what-is-it" className="hover:underline">What is the inburgering exam?</a></li>
              <li><a href="#who-needs-it" className="hover:underline">Who needs to take it?</a></li>
              <li><a href="#five-modules" className="hover:underline">The 5 exam modules explained</a></li>
              <li><a href="#format-scoring" className="hover:underline">Exam format &amp; scoring</a></li>
              <li><a href="#registration" className="hover:underline">How to register at DUO</a></li>
              <li><a href="#exemptions" className="hover:underline">Exemptions (vrijstelling)</a></li>
              <li><a href="#preparation-tips" className="hover:underline">Preparation tips</a></li>
              <li><a href="#start-practicing" className="hover:underline">Start practicing</a></li>
            </ul>
          </nav>

          {/* What is it */}
          <section id="what-is-it" className="mb-10">
            <h3 className="text-2xl font-semibold text-[var(--ink)] mb-4">
              What is the inburgering exam?
            </h3>
            <div className="space-y-4 text-[var(--ink)]/70 leading-relaxed">
              <p>
                The inburgering exam (inburgeringsexamen) is the Dutch civic integration exam. It is a mandatory
                requirement for most non-EU immigrants who want to settle permanently in the Netherlands or apply
                for Dutch citizenship.
              </p>
              <p>
                The exam tests two things: your ability to use the Dutch language in everyday situations, and your
                knowledge of Dutch society, norms, and institutions. It was created to help newcomers participate
                fully in Dutch life &mdash; from visiting the doctor to understanding how schools work.
              </p>
              <p>
                The current exam system operates under the Civic Integration Act 2021 (Wet inburgering 2021 or
                Wi2021), which replaced the previous system. Under this law, your municipality plays a central
                role in guiding your integration pathway.
              </p>
            </div>
          </section>

          {/* Who needs it */}
          <section id="who-needs-it" className="mb-10">
            <h3 className="text-2xl font-semibold text-[var(--ink)] mb-4">
              Who needs to take the inburgering exam?
            </h3>
            <div className="space-y-4 text-[var(--ink)]/70 leading-relaxed">
              <p>
                Most non-EU/EEA nationals between 18 and 67 who have received a residence permit in the Netherlands
                are required to pass the inburgering exam. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>People who came to the Netherlands for family reunification or family formation</li>
                <li>Asylum seekers who received a residence permit</li>
                <li>Religious leaders and spiritual counselors</li>
                <li>People applying for Dutch citizenship (naturalization)</li>
              </ul>
              <p>
                You typically have 3 years from your permit date to complete all required components. Your municipality
                will create a Personal Integration and Participation Plan (PIP) that outlines your specific requirements
                and timeline.
              </p>
            </div>
          </section>

          {/* Five modules */}
          <section id="five-modules" className="mb-10">
            <h3 className="text-2xl font-semibold text-[var(--ink)] mb-4">
              The 5 exam modules explained
            </h3>
            <div className="space-y-6">
              {/* Lezen */}
              <div className="landing-card p-6">
                <h4 className="font-semibold text-[var(--ink)] text-lg mb-2">
                  1. Lezen (Reading)
                </h4>
                <p className="text-[var(--ink)]/70 leading-relaxed mb-3">
                  The reading module tests your ability to understand written Dutch. You will read short texts
                  like signs, letters, advertisements, and articles, then answer multiple-choice questions about
                  what you read. Topics cover everyday situations: a letter from the municipality, a doctor&apos;s
                  appointment confirmation, or rules for an apartment building.
                </p>
                <p className="text-[var(--ink)]/50 text-sm">
                  Duration: ~35 minutes &bull; Format: Multiple-choice &bull; Level: A2
                </p>
                <Link
                  href="/learn/lezen/select"
                  className="inline-block mt-3 text-[var(--accent)] font-medium hover:underline"
                >
                  Practice Lezen &rarr;
                </Link>
              </div>

              {/* Luisteren */}
              <div className="landing-card p-6">
                <h4 className="font-semibold text-[var(--ink)] text-lg mb-2">
                  2. Luisteren (Listening)
                </h4>
                <p className="text-[var(--ink)]/70 leading-relaxed mb-3">
                  The listening module tests your ability to understand spoken Dutch. You will hear recordings of
                  conversations, announcements, and phone calls, then answer questions about what you heard. Each
                  audio clip is played twice. Scenarios include conversations at a bakery, a phone call with a
                  colleague, or an announcement at a government office.
                </p>
                <p className="text-[var(--ink)]/50 text-sm">
                  Duration: ~45 minutes &bull; Format: Multiple-choice &bull; Level: A2
                </p>
                <Link
                  href="/learn/luisteren/select"
                  className="inline-block mt-3 text-[var(--accent)] font-medium hover:underline"
                >
                  Practice Luisteren &rarr;
                </Link>
              </div>

              {/* KNM */}
              <div className="landing-card p-6">
                <h4 className="font-semibold text-[var(--ink)] text-lg mb-2">
                  3. KNM (Kennis van de Nederlandse Maatschappij)
                </h4>
                <p className="text-[var(--ink)]/70 leading-relaxed mb-3">
                  The KNM module tests your knowledge of Dutch society. It covers 8 topics: work and income, housing,
                  health and healthcare, Dutch history, education, norms and values, politics and government, and
                  geography. Questions are multiple-choice and test practical knowledge &mdash; like knowing which
                  emergency number to call or how the Dutch school system works.
                </p>
                <p className="text-[var(--ink)]/50 text-sm">
                  Duration: ~45 minutes &bull; 40 questions &bull; Format: Multiple-choice
                </p>
                <Link
                  href="/learn/knm/select"
                  className="inline-block mt-3 text-[var(--accent)] font-medium hover:underline"
                >
                  Practice KNM &rarr;
                </Link>
              </div>

              {/* Schrijven */}
              <div className="landing-card p-6">
                <h4 className="font-semibold text-[var(--ink)] text-lg mb-2">
                  4. Schrijven (Writing)
                </h4>
                <p className="text-[var(--ink)]/70 leading-relaxed mb-3">
                  The writing module tests your ability to produce written Dutch. You will complete 4 tasks: writing
                  an email (e.g., to your child&apos;s school), filling out a form, writing a short message, and replying
                  to a message. You type your answers on the computer. The tasks are based on real-life situations
                  that you would encounter in the Netherlands.
                </p>
                <p className="text-[var(--ink)]/50 text-sm">
                  Duration: ~35 minutes &bull; 4 tasks &bull; Level: A2
                </p>
                <Link
                  href="/learn/schrijven"
                  className="inline-block mt-3 text-[var(--accent)] font-medium hover:underline"
                >
                  Practice Schrijven &rarr;
                </Link>
              </div>

              {/* Spreken */}
              <div className="landing-card p-6">
                <h4 className="font-semibold text-[var(--ink)] text-lg mb-2">
                  5. Spreken (Speaking)
                </h4>
                <p className="text-[var(--ink)]/70 leading-relaxed mb-3">
                  The speaking module tests your ability to speak Dutch. The exam has 4 parts: retelling a short
                  story, describing a picture or situation, giving your opinion on a topic, and reacting to a
                  situation. You wear a headset and your answers are recorded. There is no live conversation with an
                  examiner &mdash; everything is computer-based.
                </p>
                <p className="text-[var(--ink)]/50 text-sm">
                  Duration: ~20 minutes &bull; 4 parts &bull; Level: A2
                </p>
                <Link
                  href="/learn/spreken"
                  className="inline-block mt-3 text-[var(--accent)] font-medium hover:underline"
                >
                  Practice Spreken &rarr;
                </Link>
              </div>
            </div>
          </section>

          {/* Format & Scoring */}
          <section id="format-scoring" className="mb-10">
            <h3 className="text-2xl font-semibold text-[var(--ink)] mb-4">
              Exam format &amp; scoring
            </h3>
            <div className="space-y-4 text-[var(--ink)]/70 leading-relaxed">
              <p>
                All exam modules are taken on a computer at an official DUO exam location. For the Spreken module,
                you use a headset with a microphone. Each module is taken separately &mdash; you can schedule
                them on the same day or spread them out over multiple sessions.
              </p>
              <p>
                For the multiple-choice modules (Lezen, Luisteren, KNM), you need to answer approximately 60% of
                questions correctly to pass. The Schrijven and Spreken modules are graded against CEFR criteria and
                you need to demonstrate at least A2 level proficiency.
              </p>
              <p>
                Results are typically available within 8 weeks through your DUO account. You receive a pass or fail
                result for each module, along with a score indication. If you fail a module, you can retake just that
                module without affecting your results on other modules.
              </p>
            </div>
          </section>

          {/* Registration */}
          <section id="registration" className="mb-10">
            <h3 className="text-2xl font-semibold text-[var(--ink)] mb-4">
              How to register at DUO
            </h3>
            <div className="space-y-4 text-[var(--ink)]/70 leading-relaxed">
              <p>
                You register for the exam through DUO (Dienst Uitvoering Onderwijs), the Dutch government agency
                responsible for the inburgering exam. Here is the step-by-step process:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>Get a DigiD</strong> &mdash; You need a DigiD (digital identity) to access the DUO portal.
                  Apply at digid.nl if you do not have one yet.
                </li>
                <li>
                  <strong>Log in at inburgeren.nl</strong> &mdash; Use your DigiD to access the exam registration
                  system.
                </li>
                <li>
                  <strong>Choose your modules</strong> &mdash; Select which exam modules you want to take. You can
                  register for multiple modules at once or take them one at a time.
                </li>
                <li>
                  <strong>Pick a date and location</strong> &mdash; Choose from available exam dates and locations
                  near you. Book early, as popular dates fill up quickly.
                </li>
                <li>
                  <strong>Pay the exam fees</strong> &mdash; Each module costs approximately &euro;40&ndash;50. Pay
                  online via iDEAL during registration.
                </li>
              </ol>
              <p>
                Bring a valid ID (passport, ID card, or residence permit) to the exam. Arrive at least 15 minutes
                early. No phones, dictionaries, or other aids are allowed in the exam room.
              </p>
            </div>
          </section>

          {/* Exemptions */}
          <section id="exemptions" className="mb-10">
            <h3 className="text-2xl font-semibold text-[var(--ink)] mb-4">
              Exemptions (vrijstelling)
            </h3>
            <div className="space-y-4 text-[var(--ink)]/70 leading-relaxed">
              <p>
                Some groups are exempt from the inburgering requirement. You may be eligible for vrijstelling if you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Are a citizen of an EU/EEA country or Switzerland</li>
                <li>Have a Dutch education diploma (MBO-2 level or higher)</li>
                <li>Are a Turkish national (under the EU-Turkey Association Agreement)</li>
                <li>Are 67 years of age or older</li>
                <li>Have had an uninterrupted Dutch residence permit for 8+ years</li>
                <li>Have a medical condition that prevents you from learning Dutch (requires medical evidence)</li>
              </ul>
              <p>
                To apply for exemption, submit a request through DUO with supporting documentation. Processing
                takes several weeks.
              </p>
            </div>
          </section>

          {/* Preparation tips */}
          <section id="preparation-tips" className="mb-10">
            <h3 className="text-2xl font-semibold text-[var(--ink)] mb-4">
              Preparation tips
            </h3>
            <div className="space-y-4 text-[var(--ink)]/70 leading-relaxed">
              <p>
                Based on feedback from thousands of exam takers, here are the most effective ways to prepare:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Practice on a computer.</strong> The real exam is computer-based. Practicing on paper or
                  flash cards is not enough. Use a platform like passinburgering that simulates the actual exam
                  interface.
                </li>
                <li>
                  <strong>Take full mock exams under timed conditions.</strong> Familiarize yourself with the time
                  pressure. Aim to finish each module with a few minutes to spare.
                </li>
                <li>
                  <strong>Focus on your weakest modules first.</strong> Use practice exams to identify which topics
                  need the most work, then study those intensively.
                </li>
                <li>
                  <strong>For KNM, study systematically by topic.</strong> The 8 KNM topics are well-defined.
                  Cover each one thoroughly rather than skipping around.
                </li>
                <li>
                  <strong>For Luisteren, practice with Dutch audio daily.</strong> Listen to Dutch news,
                  podcasts, or conversations to train your ear. Speed and accents vary in the exam.
                </li>
                <li>
                  <strong>For Schrijven, practice common email patterns.</strong> Most writing tasks follow predictable
                  formats: informing about an absence, making a request, responding to an invitation.
                </li>
                <li>
                  <strong>For Spreken, record yourself and listen back.</strong> Practice speaking clearly and at a
                  natural pace. You do not need perfect grammar &mdash; clear communication matters most.
                </li>
                <li>
                  <strong>Aim for 80%+ on practice exams.</strong> The passing score is around 60%, but you want a
                  comfortable margin. If you consistently score above 80% in practice, you are likely ready.
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section id="start-practicing" className="mb-10">
            <div className="landing-card p-8 text-center">
              <h3 className="text-2xl font-semibold text-[var(--ink)] mb-3">
                Ready to start practicing?
              </h3>
              <p className="text-[var(--ink)]/60 mb-6 max-w-lg mx-auto">
                Try sample questions from all 5 modules for free. No account required. See where you stand
                before your exam.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/try"
                  className="cta-primary px-8 py-3 text-white rounded-lg font-medium"
                >
                  Take Free Assessment
                </Link>
                <Link
                  href="/learn"
                  className="px-8 py-3 border border-[var(--ink)]/20 text-[var(--ink)] rounded-lg font-medium hover:bg-[var(--ink)]/5 transition-colors"
                >
                  Browse All Modules
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
