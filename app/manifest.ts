import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "passinburgering — Dutch Inburgering Exam Practice",
    short_name: "passinburgering",
    description:
      "Free practice exams for all 5 Dutch inburgering exam modules.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFBF7",
    theme_color: "#1a1a2e",
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
