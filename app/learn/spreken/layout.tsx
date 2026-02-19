import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Spreken (Speaking) Practice — 6 Mock Exams",
  description:
    "Practice for the Dutch inburgering Spreken exam with 6 mock exams across A1, A2 & B1 levels. All 4 exam parts: personal questions, describing pictures, giving opinions, and retelling events.",
};

export default function SprekenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://passinburgering.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Practice Exams",
              item: "https://passinburgering.com/learn",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Spreken (Speaking)",
              item: "https://passinburgering.com/learn/spreken/select",
            },
          ],
        }}
      />
      {children}
    </>
  );
}
