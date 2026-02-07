import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Practice Exams",
  description:
    "Practice all 5 Dutch inburgering exam modules: Lezen (Reading), Luisteren (Listening), KNM (Dutch Society), Schrijven (Writing), and Spreken (Speaking).",
};

export default function LearnLayout({
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
          ],
        }}
      />
      {children}
    </>
  );
}
