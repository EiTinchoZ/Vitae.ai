import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Martín Bundy · Ingeniería industrial e IA aplicada",
    short_name: "Martín Bundy",
    description: "Martín Bundy, Panamá. Ingeniería industrial e IA aplicada: agentes, automatización y procesos.",
    lang: "es",
    start_url: "/",
    display: "standalone",
    background_color: "#09090A",
    theme_color: "#09090A",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
