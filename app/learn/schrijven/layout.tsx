import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Schrijven (Writing) Practice",
  description:
    "Practice writing tasks for the Dutch inburgering Schrijven exam. 4 realistic tasks: emails, forms, messages, and replies in Dutch.",
};

export default function SchrijvenLayout({
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
              name: "Schrijven (Writing)",
              item: "https://passinburgering.com/learn/schrijven",
            },
          ],
        }}
      />
      {children}
    </>
  );
}
