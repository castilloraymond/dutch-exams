import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Blog — Tips & Guides for the Inburgering Exam",
  description:
    "Practical tips, study guides, and insights for passing the Dutch inburgering exam. From exam strategies to life in the Netherlands.",
  alternates: {
    canonical: "https://passinburgering.com/blog",
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
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
              Blog
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center py-16">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--landing-navy)] mb-4">
            Coming Soon
          </h2>
          <p className="font-sans-landing text-[var(--landing-navy)]/60 text-lg mb-8 max-w-md mx-auto">
            We are working on practical tips and study guides to help you prepare
            for the inburgering exam. Check back soon!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/guide"
              className="cta-primary px-8 py-3 text-white rounded-lg font-medium"
            >
              Read the Exam Guide
            </Link>
            <Link
              href="/faq"
              className="px-8 py-3 border border-[var(--landing-navy)]/20 text-[var(--landing-navy)] rounded-lg font-medium hover:bg-[var(--landing-navy)]/5 transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
