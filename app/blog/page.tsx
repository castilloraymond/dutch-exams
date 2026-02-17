import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
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
  const featuredPosts = posts.filter((p) => p.featured);
  const allPosts = posts;

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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--ink)] mb-4">
            Tips & Guides
          </h2>
          <p className="text-[var(--ink)]/60 text-lg mb-10">
            Practical advice for passing the Dutch inburgering exam efficiently.
          </p>

          {/* Start Here — Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 text-[var(--accent)]" fill="var(--accent)" />
                <h3 className="text-lg font-semibold text-[var(--ink)]">
                  Start Here
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="landing-card block rounded-2xl p-6 border-2 border-[var(--accent)]/15 hover:border-[var(--accent)]/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                        Essential Guide
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--cream-dark)] text-[var(--ink-soft)] font-medium">
                        {post.category}
                      </span>
                    </div>
                    <h4 className="font-semibold text-[var(--ink)] text-lg mb-2 leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-[var(--ink-soft)] text-sm leading-relaxed mb-3">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
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
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Articles */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--ink)] mb-6">
              All Articles
            </h3>
            <div className="space-y-5">
              {allPosts.map((post) => (
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
                    <span>·</span>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--cream-dark)] text-[var(--ink-soft)] font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-[var(--ink)] text-lg mb-2">
                    {post.title}
                  </h4>
                  <p className="text-[var(--ink-soft)] text-sm leading-relaxed">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
