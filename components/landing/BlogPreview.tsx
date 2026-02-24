import Link from "next/link";
import { getAllBlogPosts, type BlogPostMeta } from "@/lib/blog";
import { BlogPreviewCards } from "./BlogPreviewCards";

export function BlogPreview() {
    const posts = getAllBlogPosts().slice(0, 3);

    if (posts.length === 0) return null;

    return (
        <section className="py-10 sm:py-[70px] px-6 lg:px-10 max-w-[1200px] mx-auto reveal">
            <div className="text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-4">
                From the blog
            </div>
            <div className="flex items-end justify-between mb-6 sm:mb-[36px]">
                <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] font-extrabold">
                    Latest posts
                </h2>
                <Link
                    href="/blog"
                    className="text-[0.92rem] font-medium text-[var(--accent)] hover:text-[var(--accent-glow)] transition-colors hidden sm:block"
                >
                    View all posts →
                </Link>
            </div>

            <BlogPreviewCards posts={posts} />

            <div className="sm:hidden mt-8 text-center">
                <Link
                    href="/blog"
                    className="text-[0.92rem] font-medium text-[var(--accent)] hover:text-[var(--accent-glow)] transition-colors"
                >
                    View all posts →
                </Link>
            </div>
        </section>
    );
}
