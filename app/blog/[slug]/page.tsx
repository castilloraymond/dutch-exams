import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { JsonLd } from "@/components/JsonLd";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getBlogPost(params.slug);
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

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen flex flex-col bg-[var(--landing-cream)]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: {
            "@type": "Person",
            name: post.author,
          },
          publisher: {
            "@type": "Organization",
            name: "passinburgering",
            url: "https://passinburgering.com",
          },
          mainEntityOfPage: `https://passinburgering.com/blog/${post.slug}`,
        }}
      />

      <header className="border-b border-[var(--landing-navy)]/10 sticky top-0 bg-[var(--landing-cream)] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
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

      <article className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans-landing text-sm text-[var(--landing-navy)]/40 mb-4">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" "}· {post.author}
          </p>

          <div
            className="prose-navy"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <LandingFooter />
    </main>
  );
}
