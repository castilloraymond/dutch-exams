import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Luisteren (Listening) Practice",
  description:
    "Practice listening comprehension for the Dutch inburgering Luisteren exam. 5 audio exercises with 20 questions based on real-life Dutch conversations.",
};

export default function LuisterenLayout({
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
              name: "Luisteren (Listening)",
              item: "https://passinburgering.com/learn/luisteren/select",
            },
          ],
        }}
      />
      {children}
    </>
  );
}
