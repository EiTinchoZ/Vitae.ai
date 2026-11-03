import type { NextConfig } from "next";

const appMode = (process.env.NEXT_PUBLIC_APP_MODE ?? 'personal').trim();
const isDemoMode = appMode === 'demo';

// Use relative path for alias - absolute paths don't work in Vercel/Turbopack
const demoAlias: Record<string, string> = isDemoMode
  ? {
    '@/data/cv-data': './src/data/cv-data.example.ts',
  }
  : {};

const nextConfig: NextConfig = {
  // Claude y Codex compilan en la misma carpeta: Codex usa NEXT_DIST_DIR=.next-codex para no pisar el build de Claude.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Dos layouts raíz (es y en): la 404 de URLs inexistentes vive en app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  turbopack: {
    resolveAlias: demoAlias,
  },
  webpack: (config) => {
    if (isDemoMode) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        ...demoAlias,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob:; connect-src 'self'; worker-src 'self' blob:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
