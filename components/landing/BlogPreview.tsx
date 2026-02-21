import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";

export function BlogPreview() {
    const posts = getAllBlogPosts().slice(0, 3);

    if (posts.length === 0) return null;

    return (
        <section className="py-12 sm:py-[70px] px-5 sm:px-6 lg:px-10 max-w-[1200px] mx-auto reveal">
            <div className="text-[0.78rem] sm:text-[0.8rem] font-semibold text-[var(--accent)] uppercase tracking-[0.1em] mb-3 sm:mb-4">
                From the blog
            </div>
            <div className="flex items-end justify-between mb-6 sm:mb-[36px]">
                <h2 className="text-[1.7rem] sm:text-[clamp(2rem,3vw,2.6rem)] leading-[1.2] text-[var(--ink)] tracking-[-0.03em] font-extrabold">
                    Latest posts
                </h2>
                <Link
                    href="/blog"
                    className="text-[0.88rem] sm:text-[0.92rem] font-medium text-[var(--accent)] hover:text-[var(--accent-glow)] transition-colors hidden sm:block"
                >
                    View all posts →
                </Link>
            </div>

            {/* Mobile: horizontal scroll / Desktop: grid */}
            <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none -mx-5 px-5 sm:mx-0 sm:px-0 pb-2 sm:pb-0 scrollbar-none">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#ebe8e0] hover:shadow-[var(--shadow-hover)] hover:border-transparent transition-all duration-300 flex flex-col min-w-[260px] sm:min-w-0 snap-start shrink-0 sm:shrink"
                    >
                        <div className="text-[0.75rem] sm:text-[0.78rem] text-[var(--ink-muted)] mb-2.5 sm:mb-3">
                            {new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                        <h3 className="text-[1rem] sm:text-[1.1rem] font-bold text-[var(--ink)] mb-2 sm:mb-2.5 leading-[1.4]">
                            {post.title}
                        </h3>
                        <p className="text-[0.85rem] sm:text-[0.92rem] text-[var(--ink-soft)] leading-[1.6] sm:leading-[1.65] flex-1 mb-3 sm:mb-4">
                            {post.description}
                        </p>
                        <span className="text-[0.85rem] sm:text-[0.88rem] font-medium text-[var(--accent)]">
                            Read more →
                        </span>
                    </Link>
                ))}
            </div>

            <div className="sm:hidden mt-6 text-center">
                <Link
                    href="/blog"
                    className="text-[0.88rem] font-medium text-[var(--accent)] hover:text-[var(--accent-glow)] transition-colors"
                >
                    View all posts →
                </Link>
            </div>
        </section>
    );
}
