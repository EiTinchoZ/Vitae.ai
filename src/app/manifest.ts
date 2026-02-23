import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vitae.ai | Martin Bundy - CV Digital con IA",
    short_name: "Vitae.ai",
    description:
      "CV digital interactivo de Martin Bundy con analisis de IA, recomendaciones personalizadas y chat inteligente.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
