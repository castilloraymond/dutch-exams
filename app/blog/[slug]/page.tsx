import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { JsonLd } from "@/components/JsonLd";
import { BlogCTA } from "@/components/BlogCTA";
import { ShareButtons } from "@/components/ShareButtons";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://passinburgering.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://passinburgering.com/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const postUrl = `https://passinburgering.com/blog/${post.slug}`;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream)]">
      {/* Article structured data */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          wordCount: post.wordCount,
          keywords: post.keywords.join(", "),
          author: {
            "@type": "Person",
            name: post.author,
          },
          publisher: {
            "@type": "Organization",
            name: "passinburgering",
            url: "https://passinburgering.com",
          },
          mainEntityOfPage: postUrl,
          image: "https://passinburgering.com/og-image.png",
        }}
      />

      {/* FAQ structured data */}
      {post.faqItems.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faqItems.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }}
        />
      )}

      <header className="border-b border-[var(--ink)]/10 sticky top-0 bg-[var(--cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
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

      <article className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--ink)] leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-[var(--ink-soft)] mb-8 pb-8 border-b border-[var(--ink)]/10">
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>

          {/* Main content before FAQ — sanitized via DOMPurify in lib/blog.ts */}
          <div
            className="prose-navy"
            dangerouslySetInnerHTML={{ __html: post.contentMain }}
          />

          {/* Inline CTA before FAQ */}
          <BlogCTA />

          {/* FAQ section — sanitized via DOMPurify in lib/blog.ts */}
          {post.contentFAQ && (
            <div
              className="prose-navy"
              dangerouslySetInnerHTML={{ __html: post.contentFAQ }}
            />
          )}

          {/* Share buttons */}
          <ShareButtons title={post.title} url={postUrl} />
        </div>
      </article>

      <LandingFooter />
    </main>
  );
}
