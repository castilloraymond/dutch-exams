import type { MetadataRoute } from "next";

const BASE_URL = "https://passinburgering.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/blog/learning-resources`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  // Quick assessment (try) pages
  const tryPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/try`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // Learn module pages
  const learnPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },

    // Lezen
    { url: `${BASE_URL}/learn/lezen/select`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // KNM
    { url: `${BASE_URL}/learn/knm/select`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Luisteren
    { url: `${BASE_URL}/learn/luisteren/select`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Schrijven
    { url: `${BASE_URL}/learn/schrijven`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Spreken
    { url: `${BASE_URL}/learn/spreken`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic passage pages (Lezen)
  const passageIds = [
    "tips-om-goed-te-leren",
    "brief-van-de-gemeente",
    "advertentie-cursus-nederlands",
    "artikel-fietsen-in-nederland",
    "huisregels-appartementencomplex",
  ];
  const passagePages: MetadataRoute.Sitemap = passageIds.map((id) => ({
    url: `${BASE_URL}/learn/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // KNM topic pages
  const knmTopicIds = [
    "werk", "wonen", "gezondheid", "geschiedenis",
    "onderwijs", "normen-en-waarden", "politiek", "geografie",
  ];
  const knmPages: MetadataRoute.Sitemap = knmTopicIds.map((id) => ({
    url: `${BASE_URL}/learn/knm/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Luisteren exercise pages
  const luisterenIds = [
    "bij-de-bakker", "op-het-gemeentehuis", "een-telefoongesprek",
    "bij-de-huisarts", "op-het-werk",
  ];
  const luisterenPages: MetadataRoute.Sitemap = luisterenIds.map((id) => ({
    url: `${BASE_URL}/learn/luisteren/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Schrijven task pages
  const schrijvenIds = [
    "email-school-sick", "message-landlord-repair",
    "form-course-registration", "reply-colleague-shift",
  ];
  const schrijvenPages: MetadataRoute.Sitemap = schrijvenIds.map((id) => ({
    url: `${BASE_URL}/learn/schrijven/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Spreken task pages
  const sprekenIds = [
    "part1-homework", "part2-lunch", "part3-education", "part4-classroom",
  ];
  const sprekenPages: MetadataRoute.Sitemap = sprekenIds.map((id) => ({
    url: `${BASE_URL}/learn/spreken/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Blog pages (placeholder slugs — will be dynamic once blog engine is built)
  const blogSlugs = [
    "inburgering-exam-guide-professionals-2026",
    "knm-exam-2026-new-format",
    "inburgering-kennismigranten-30-percent-ruling",
  ];
  const blogPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ...blogSlugs.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [
    ...staticPages,
    ...tryPages,
    ...learnPages,
    ...passagePages,
    ...knmPages,
    ...luisterenPages,
    ...schrijvenPages,
    ...sprekenPages,
    ...blogPages,
  ];
}
