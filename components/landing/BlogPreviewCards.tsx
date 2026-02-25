"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";

export function BlogPreviewCards({ posts }: { posts: BlogPostMeta[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const onScroll = () => {
            const { scrollLeft } = container;
            const cardWidth = (container.firstElementChild as HTMLElement)?.offsetWidth ?? 1;
            const gap = 16; // gap-4
            const idx = Math.round(scrollLeft / (cardWidth + gap));
            setActiveIndex(Math.min(idx, posts.length - 1));
        };
        container.addEventListener("scroll", onScroll, { passive: true });
        return () => container.removeEventListener("scroll", onScroll);
    }, [posts.length]);

    return (
        <>
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0"
            >
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="w-[calc(100vw-48px)] min-w-[calc(100vw-48px)] snap-start shrink-0 md:w-auto md:min-w-0 md:shrink bg-white rounded-[16px] p-5 sm:p-8 border border-[var(--ink)]/15 hover:shadow-[var(--shadow-hover)] hover:border-transparent transition-all duration-300 flex flex-col"
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
            {/* Dot indicators — mobile only */}
            <div className="flex justify-center gap-2 mt-4 md:hidden">
                {posts.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            i === activeIndex ? "bg-[var(--ink)]" : "bg-[var(--ink)]/20"
                        }`}
                    />
                ))}
            </div>
        </>
    );
}
