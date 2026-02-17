import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPostMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  keywords: string[];
  readingTime: number; // minutes
  category: string;
  featured?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string; // parsed HTML — full content
  contentMain: string; // HTML before FAQ section
  contentFAQ: string; // HTML of FAQ section onward
  faqItems: FAQItem[];
  wordCount: number;
}

const SANITIZE_OPTIONS = {
  ALLOWED_TAGS: [
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li",
    "blockquote", "code", "pre", "em", "strong", "br", "hr", "img",
    "table", "thead", "tbody", "tr", "th", "td", "del", "sup", "sub",
    "div", "span",
  ],
  ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
};

function parseFAQs(html: string): FAQItem[] {
  const items: FAQItem[] = [];

  // Match the FAQ section: <h2> containing "Frequently Asked Questions" text
  // marked() doesn't add id attributes by default, so match on text content
  // Use flexible match — some posts add context after "Frequently Asked Questions"
  const faqSectionMatch = html.match(
    /<h2[^>]*>Frequently Asked Questions[^<]*<\/h2>([\s\S]*?)(?=<h2[^>]*>|$)/i
  );
  if (!faqSectionMatch) return items;

  const faqHtml = faqSectionMatch[1];
  const questionRegex = /<h3[^>]*>(.*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>|$)/g;
  let match;

  while ((match = questionRegex.exec(faqHtml)) !== null) {
    const question = match[1].replace(/<[^>]+>/g, "").trim();
    const answer = match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return items;
}

function splitContentAtFAQ(html: string): { main: string; faq: string } {
  // Split at the FAQ h2 heading (match on text content, not id attribute)
  // Flexible match — some posts add context after "Frequently Asked Questions"
  const match = html.match(/<h2[^>]*>Frequently Asked Questions[^<]*<\/h2>/i);

  if (!match || match.index === undefined) {
    return { main: html, faq: "" };
  }

  return {
    main: html.slice(0, match.index),
    faq: html.slice(match.index),
  };
}

export function getAllBlogPosts(): BlogPostMeta[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(wordCount / 250));
    return {
      ...(data as Omit<BlogPostMeta, "readingTime">),
      readingTime,
      category: (data.category as string) || "General",
      featured: (data.featured as boolean) || false,
    } as BlogPostMeta;
  });

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | null {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  for (const filename of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      const wordCount = content.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.round(wordCount / 250));
      const fullHtml = DOMPurify.sanitize(marked(content) as string, SANITIZE_OPTIONS);
      const faqItems = parseFAQs(fullHtml);
      const { main, faq } = splitContentAtFAQ(fullHtml);

      return {
        ...(data as Omit<BlogPostMeta, "readingTime">),
        readingTime,
        category: (data.category as string) || "General",
        featured: (data.featured as boolean) || false,
        content: fullHtml,
        contentMain: main,
        contentFAQ: faq,
        faqItems,
        wordCount,
      };
    }
  }

  return null;
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((post) => post.slug);
}
