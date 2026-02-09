import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { JsonLd } from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://passinburgering.com"),
  title: {
    default: "passinburgering | Pass Your Dutch Inburgering Exam First Try",
    template: "%s | passinburgering",
  },
  description:
    "The most efficient inburgering exam prep for busy professionals. Practice all 5 modules — KNM, Lezen, Luisteren, Schrijven & Spreken — updated for 2025 exam changes.",
  keywords: [
    "inburgering exam",
    "inburgeringsexamen",
    "Dutch civic integration",
    "KNM exam",
    "Lezen exam",
    "Luisteren exam",
    "Schrijven exam",
    "Spreken exam",
    "inburgering practice",
    "inburgering oefenen",
    "Dutch integration test",
    "DUO exam preparation",
    "Netherlands immigration exam",
    "kennismigrant inburgering",
    "30% ruling inburgering",
    "inburgering 2025",
    "KNM exam 2025",
    "inburgering permanent residence",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    canonical: "https://passinburgering.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "passinburgering | Pass Your Dutch Inburgering Exam First Try",
    description:
      "The most efficient inburgering exam prep for busy professionals. Practice all 5 modules — KNM, Lezen, Luisteren, Schrijven & Spreken — updated for 2025 exam changes.",
    type: "website",
    url: "https://passinburgering.com",
    siteName: "passinburgering",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "passinburgering — Dutch Inburgering Exam Practice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "passinburgering | Pass Your Dutch Inburgering Exam First Try",
    description:
      "The most efficient inburgering exam prep for busy professionals. Practice all 5 modules — updated for 2025 exam changes.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "passinburgering",
            url: "https://passinburgering.com",
            description:
              "The most efficient inburgering exam prep for busy professionals. Practice all 5 modules — KNM, Lezen, Luisteren, Schrijven & Spreken — updated for 2025 exam changes.",
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "passinburgering",
            url: "https://passinburgering.com",
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <FeedbackWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
