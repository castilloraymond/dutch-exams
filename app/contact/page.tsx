import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the passinburgering team. Questions about the inburgering exam or our practice platform? We respond within 24-48 hours.",
};

export default function ContactPage() {
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
              Contact Us
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl font-semibold text-[var(--landing-navy)] mb-4">
            Get in Touch
          </h2>

          <p className="text-[var(--landing-navy)]/70 mb-8">
            Have questions, feedback, or suggestions? We&apos;d love to hear from you.
          </p>

          <div className="landing-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[var(--landing-orange)]/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-[var(--landing-orange)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--landing-navy)]">Email Us</h3>
                <p className="text-sm text-[var(--landing-navy)]/60">
                  We typically respond within 24-48 hours
                </p>
              </div>
            </div>

            <a
              href="mailto:hello@passinburgering.com"
              className="inline-block cta-primary px-6 py-3 text-white rounded-lg font-medium"
            >
              hello@passinburgering.com
            </a>
          </div>

          <div className="mt-8 p-4 bg-[var(--landing-navy)]/5 rounded-lg">
            <p className="text-sm text-[var(--landing-navy)]/60">
              For technical issues, please include details about your browser and device
              to help us assist you better.
            </p>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
