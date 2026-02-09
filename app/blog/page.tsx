import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Tips & Guides for the Inburgering Exam",
  description:
    "Practical tips, study guides, and insights for passing the Dutch inburgering exam. From exam strategies to life in the Netherlands.",
  alternates: {
    canonical: "https://passinburgering.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

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
        <div className="max-w-3xl mx-auto">
<<<<<<< HEAD
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--landing-navy)] mb-2">
            Tips &amp; Guides
          </h2>
          <p className="font-sans-landing text-[var(--landing-navy)]/60 mb-8">
            Practical advice to help you prepare for the inburgering exam.
          </p>

          {/* Blog post listing */}
          <div className="space-y-4 mb-12">
            <Link
              href="/blog/learning-resources"
              className="landing-card p-6 block hover:border-[var(--landing-orange)]/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--landing-orange)]/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-[var(--landing-orange)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-sans-landing font-semibold text-[var(--landing-navy)] text-lg mb-1 group-hover:text-[var(--landing-orange)] transition-colors">
                    Best Free Resources to Learn Dutch for Inburgering
                  </h3>
                  <p className="font-sans-landing text-[var(--landing-navy)]/60 text-sm mb-3">
                    A curated list of the best free and paid resources to learn Dutch and prepare for the inburgering exam. Apps, websites, practice exams, and community tips.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[var(--landing-orange)] font-medium text-sm">
                    Read more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Related links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/guide"
              className="cta-primary px-8 py-3 text-white rounded-lg font-medium text-center"
            >
              Read the Exam Guide
            </Link>
            <Link
              href="/faq"
              className="px-8 py-3 border border-[var(--landing-navy)]/20 text-[var(--landing-navy)] rounded-lg font-medium hover:bg-[var(--landing-navy)]/5 transition-colors text-center"
            >
              View FAQ
            </Link>
=======
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--landing-navy)] mb-4">
            Tips & Guides
          </h2>
          <p className="font-sans-landing text-[var(--landing-navy)]/60 text-lg mb-10">
            Practical advice for passing the Dutch inburgering exam efficiently.
          </p>

          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="landing-card block rounded-2xl p-6"
              >
                <p className="font-sans-landing text-xs text-[var(--landing-navy)]/40 mb-2">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h3 className="font-sans-landing font-semibold text-[var(--landing-navy)] text-lg mb-2">
                  {post.title}
                </h3>
                <p className="font-sans-landing text-[var(--landing-navy)]/60 text-sm leading-relaxed">
                  {post.description}
                </p>
              </Link>
            ))}
>>>>>>> 6564e4b (feat: add blog engine with markdown posts and prose styles)
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
