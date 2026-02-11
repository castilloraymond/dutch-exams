import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";

export function BlogPreview() {
    const posts = getAllBlogPosts().slice(0, 3);

    if (posts.length === 0) return null;

    return (
        <section className="py-[100px] px-6 lg:px-10 max-w-[1200px] mx-auto reveal">
            <div className="text-[0.8rem] font-semibold text-[var(--ink-muted)] uppercase tracking-[0.1em] mb-4">
                From the blog
            </div>
            <div className="flex items-end justify-between mb-[50px]">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="bg-white rounded-[16px] p-8 border border-[#ebe8e0] hover:shadow-[var(--shadow-hover)] hover:border-transparent transition-all duration-300 flex flex-col"
                    >
                        <div className="text-[0.78rem] text-[var(--ink-muted)] mb-3">
                            {new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                        <h3 className="text-[1.1rem] font-bold text-[var(--ink)] mb-2.5 leading-[1.4]">
                            {post.title}
                        </h3>
                        <p className="text-[0.92rem] text-[var(--ink-soft)] leading-[1.65] flex-1 mb-4">
                            {post.description}
                        </p>
                        <span className="text-[0.88rem] font-medium text-[var(--accent)]">
                            Read more →
                        </span>
                    </Link>
                ))}
            </div>

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
