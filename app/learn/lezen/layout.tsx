import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Lezen (Reading) Practice",
  description:
    "Practice reading comprehension for the Dutch inburgering Lezen exam. 5 passages with 25 questions covering everyday Dutch topics.",
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
