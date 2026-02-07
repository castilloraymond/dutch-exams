import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Quick Assessment",
  description:
    "Take a free quick assessment to test your readiness for the Dutch inburgering exam. Sample questions from all 5 modules — no account required.",
};

export default function TryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
