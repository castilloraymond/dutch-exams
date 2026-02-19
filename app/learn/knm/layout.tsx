import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "KNM (Dutch Society) Practice — 10 Mock Exams",
  description:
    "Practice for the KNM (Kennis van de Nederlandse Maatschappij) exam. 10 mock exams across A1, A2 & B1 covering Dutch work, housing, health, history, education, and politics.",
};

export default function KnmLayout({
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
              name: "KNM (Dutch Society)",
              item: "https://passinburgering.com/learn/knm/select",
            },
          ],
        }}
      />
      {children}
    </>
  );
}
