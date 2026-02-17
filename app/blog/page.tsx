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
              Blog
            </h1>
          </div>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--ink)] mb-4">
            Tips & Guides
          </h2>
          <p className="text-[var(--ink)]/60 text-lg mb-10">
            Practical advice for passing the Dutch inburgering exam efficiently.
          </p>

          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="landing-card block rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)] mb-2">
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>{post.readingTime} min read</span>
                </div>
                <h3 className="font-semibold text-[var(--ink)] text-lg mb-2">
                  {post.title}
                </h3>
                <p className="text-[var(--ink-soft)] text-sm leading-relaxed mb-3">
                  {post.description}
                </p>
                {post.keywords && post.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.keywords.slice(0, 3).map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs px-2.5 py-1 rounded-full bg-[var(--cream-dark)] text-[var(--ink-soft)] font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
