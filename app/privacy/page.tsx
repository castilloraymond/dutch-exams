import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto prose prose-slate">
          <h2 className="font-serif text-2xl font-semibold text-[var(--landing-navy)] mb-4">
            Privacy Policy
          </h2>

          <p className="text-[var(--landing-navy)]/70 mb-4">
            Last updated: February 2026
          </p>

          <h3 className="font-semibold text-[var(--landing-navy)] mt-6 mb-2">
            Information We Collect
          </h3>
          <p className="text-[var(--landing-navy)]/70 mb-4">
            We collect information you provide directly to us, such as when you create an account,
            complete practice exercises, or contact us for support. This may include your email address
            and learning progress data.
          </p>

          <h3 className="font-semibold text-[var(--landing-navy)] mt-6 mb-2">
            How We Use Your Information
          </h3>
          <p className="text-[var(--landing-navy)]/70 mb-4">
            We use the information we collect to provide, maintain, and improve our services,
            track your learning progress, and communicate with you about your account.
          </p>

          <h3 className="font-semibold text-[var(--landing-navy)] mt-6 mb-2">
            Data Storage
          </h3>
          <p className="text-[var(--landing-navy)]/70 mb-4">
            Your progress data is stored locally in your browser and optionally synced to our
            secure servers if you create an account. You can delete your data at any time.
          </p>

          <h3 className="font-semibold text-[var(--landing-navy)] mt-6 mb-2">
            Contact Us
          </h3>
          <p className="text-[var(--landing-navy)]/70 mb-4">
            If you have questions about this Privacy Policy, please contact us at{" "}
            <Link href="/contact" className="text-[var(--landing-orange)] hover:underline">
              our contact page
            </Link>.
          </p>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
