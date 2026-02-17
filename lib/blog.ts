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
}

export interface BlogPost extends BlogPostMeta {
  content: string; // parsed HTML
}

export function getAllBlogPosts(): BlogPostMeta[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(wordCount / 250));
    return { ...(data as Omit<BlogPostMeta, "readingTime">), readingTime } as BlogPostMeta;
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
      return {
        ...(data as Omit<BlogPostMeta, "readingTime">),
        readingTime,
        content: DOMPurify.sanitize(marked(content) as string, {
          ALLOWED_TAGS: [
            "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li",
            "blockquote", "code", "pre", "em", "strong", "br", "hr", "img",
            "table", "thead", "tbody", "tr", "th", "td", "del", "sup", "sub",
            "div", "span",
          ],
          ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
        }),
      };
    }
  }

  return null;
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((post) => post.slug);
}
