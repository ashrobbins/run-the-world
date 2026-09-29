import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Run the World",
    short_name: "Run the World",
    description: "Turn your real runs into journeys across the globe.",
    start_url: "/home",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6C5CE7",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
