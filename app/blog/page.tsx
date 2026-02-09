import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
