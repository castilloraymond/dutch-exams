import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for using passinburgering, the Dutch inburgering exam practice platform.",
  alternates: {
    canonical: "https://passinburgering.com/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
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
              Terms of Service
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto prose prose-slate">
          <h2 className="text-2xl font-semibold text-[var(--ink)] mb-4">
            Terms of Service
          </h2>

          <p className="text-[var(--ink)]/70 mb-4">
            Last updated: February 2026
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            Acceptance of Terms
          </h3>
          <p className="text-[var(--ink)]/70 mb-4">
            By accessing or using PassInburgering, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our service.
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            Description of Service
          </h3>
          <p className="text-[var(--ink)]/70 mb-4">
            PassInburgering provides educational materials and practice exercises to help users
            prepare for the Dutch Inburgering exam. Our service is designed for educational
            purposes only.
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            User Responsibilities
          </h3>
          <p className="text-[var(--ink)]/70 mb-4">
            You are responsible for maintaining the confidentiality of your account and for all
            activities that occur under your account. You agree to use the service only for lawful purposes.
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            Disclaimer
          </h3>
          <p className="text-[var(--ink)]/70 mb-4">
            PassInburgering is an independent study resource and is not affiliated with DUO or
            the Dutch government. While we strive for accuracy, we cannot guarantee exam success.
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            Contact
          </h3>
          <p className="text-[var(--ink)]/70 mb-4">
            For questions about these Terms, please visit our{" "}
            <Link href="/contact" className="text-[var(--accent)] hover:underline">
              contact page
            </Link>.
          </p>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
