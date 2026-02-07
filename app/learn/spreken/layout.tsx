import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Spreken (Speaking) Practice",
  description:
    "Practice speaking tasks for the Dutch inburgering Spreken exam. 4 tasks covering all exam parts: retelling, describing, giving opinions, and reacting to situations.",
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
              item: "https://passinburgering.com/learn/spreken",
            },
          ],
        }}
      />
      {children}
    </>
  );
}
