import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

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
  title: "passinburgering | Pass Your Dutch Inburgering Exam First Try",
  description: "Practice with realistic exam simulations on a computer—exactly like the real test. Built by expats, for expats. 93% pass rate.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "passinburgering | Pass Your Dutch Inburgering Exam First Try",
    description: "Practice with realistic exam simulations on a computer—exactly like the real test. Built by expats, for expats.",
    type: "website",
    url: "https://passinburgering.com",
    siteName: "passinburgering",
  },
  twitter: {
    card: "summary",
    title: "passinburgering | Pass Your Dutch Inburgering Exam First Try",
    description: "Practice with realistic exam simulations on a computer—exactly like the real test. Built by expats, for expats.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
