import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' is required by Google Tag Manager — cannot be removed without switching to GTM server-side
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.clerk.accounts.dev https://*.clerk.com https://clerk.passinburgering.com https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://media.giphy.com https://images.unsplash.com https://images.pexels.com https://www.google-analytics.com https://www.googletagmanager.com https://img.clerk.com https://img.clerk.com",
      "connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://www.googletagmanager.com https://*.tts.speech.microsoft.com https://*.clerk.accounts.dev https://*.clerk.com https://clerk.passinburgering.com https://accounts.passinburgering.com https://challenges.cloudflare.com https://*.i.posthog.com",
      "media-src 'self' blob:",
      "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://accounts.passinburgering.com https://challenges.cloudflare.com",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  {
    key: "Permissions-Policy",
    value: "microphone=(self), camera=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.giphy.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/audio/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/auth/signup",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
