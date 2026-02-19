import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getMockExamIndex } from "@/lib/content";

const BASE_URL = "https://passinburgering.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/blog/learning-resources`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/upgrade`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  // Quick assessment (try) pages
  const tryPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/try`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // Learn hub + module select pages
  const learnPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/learn/lezen/select`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/learn/knm/select`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/learn/luisteren/select`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/learn/schrijven/select`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/learn/spreken/select`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Mock exam pages — dynamically generated from content
  const modules = ["lezen", "knm", "luisteren", "schrijven", "spreken"] as const;
  const mockRoute: Record<string, string> = {
    lezen: "lezen/mock",
    knm: "knm/mock",
    luisteren: "luisteren/mock",
    schrijven: "schrijven/mock",
    spreken: "spreken/mock",
  };

  const mockExamPages: MetadataRoute.Sitemap = modules.flatMap((mod) => {
    const index = getMockExamIndex(mod);
    if (!index) return [];
    return index.exams.map((exam) => ({
      url: `${BASE_URL}/learn/${mockRoute[mod]}/${exam.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  });

  // Blog pages
  const blogPosts = getAllBlogPosts();
  const blogPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [
    ...staticPages,
    ...tryPages,
    ...learnPages,
    ...mockExamPages,
    ...blogPages,
  ];
}
