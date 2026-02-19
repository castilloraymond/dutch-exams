import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How passinburgering handles your data, your GDPR rights, and our privacy practices.",
  alternates: {
    canonical: "https://passinburgering.com/privacy",
  },
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto prose prose-slate">
          <h2 className="text-2xl font-semibold text-[var(--ink)] mb-4">
            Privacy Policy
          </h2>

          <p className="text-[var(--ink)]/70 mb-4">
            Last updated: February 2026
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            Information We Collect
          </h3>
          <p className="text-[var(--ink)]/70 mb-4">
            We collect information you provide directly to us, such as when you create an account,
            complete practice exercises, or contact us for support. This may include your email address
            and learning progress data.
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            How We Use Your Information
          </h3>
          <p className="text-[var(--ink)]/70 mb-4">
            We use the information we collect to provide, maintain, and improve our services,
            track your learning progress, and communicate with you about your account.
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            Data Storage
          </h3>
          <p className="text-[var(--ink)]/70 mb-4">
            Your progress data is stored locally in your browser and optionally synced to our
            secure servers if you create an account. You can delete your data at any time.
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            Cookies &amp; Local Storage
          </h3>
          <p className="text-[var(--ink)]/70 mb-4">
            We use browser localStorage to save your learning progress and preferences locally on
            your device. We do not use tracking cookies. If you create an account, a session cookie
            is used to keep you logged in.
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            Third-Party Services
          </h3>
          <p className="text-[var(--ink)]/70 mb-2">
            We use the following third-party services to operate passinburgering:
          </p>
          <ul className="list-disc pl-6 text-[var(--ink)]/70 mb-4 space-y-1">
            <li><strong>Supabase</strong> — authentication and account management</li>
            <li><strong>Google OAuth</strong> — optional sign-in with Google</li>
            <li><strong>Vercel</strong> — hosting and content delivery</li>
          </ul>
          <p className="text-[var(--ink)]/70 mb-4">
            These services may process your data according to their own privacy policies. We do not
            sell or share your personal data with advertisers or data brokers.
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            Your Rights (GDPR)
          </h3>
          <p className="text-[var(--ink)]/70 mb-2">
            If you are located in the European Economic Area, you have the right to:
          </p>
          <ul className="list-disc pl-6 text-[var(--ink)]/70 mb-4 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Export your data in a portable format</li>
            <li>Withdraw consent for data processing at any time</li>
          </ul>
          <p className="text-[var(--ink)]/70 mb-4">
            To exercise any of these rights, please contact us using the details below.
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            Data Retention
          </h3>
          <p className="text-[var(--ink)]/70 mb-4">
            We retain your account data for as long as your account is active. If you delete your
            account, we will remove your personal data within 30 days. Anonymous, aggregated usage
            data may be retained for analytics purposes.
          </p>

          <h3 className="font-semibold text-[var(--ink)] mt-6 mb-2">
            Contact Us
          </h3>
          <p className="text-[var(--ink)]/70 mb-4">
            If you have questions about this Privacy Policy or want to make a data request, please
            contact us at{" "}
            <Link href="/contact" className="text-[var(--accent)] hover:underline">
              our contact page
            </Link>{" "}
            or email us at{" "}
            <a href="mailto:privacy@passinburgering.com" className="text-[var(--accent)] hover:underline">
              privacy@passinburgering.com
            </a>.
          </p>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
