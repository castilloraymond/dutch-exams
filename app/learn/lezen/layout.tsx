import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Lezen (Reading) Practice — 10 Mock Exams",
  description:
    "Practice reading comprehension for the Dutch inburgering Lezen exam. 10 mock exams across A1, A2 & B1 levels with realistic passages about everyday Dutch life.",
};

export default function LezenLayout({
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
              name: "Lezen (Reading)",
              item: "https://passinburgering.com/learn/lezen/select",
            },
          ],
        }}
      />
      {children}
    </>
  );
}
