import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPostMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  keywords: string[];
}

export interface BlogPost extends BlogPostMeta {
  content: string; // parsed HTML
}

export function getAllBlogPosts(): BlogPostMeta[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data } = matter(raw);
    return data as BlogPostMeta;
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
      return {
        ...(data as BlogPostMeta),
        content: marked(content) as string,
      };
    }
  }

  return null;
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((post) => post.slug);
}
