import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/profile", "/audio-test"],
      },
    ],
    sitemap: "https://passinburgering.com/sitemap.xml",
  };
}
