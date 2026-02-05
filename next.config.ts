import type { NextConfig } from "next";
import path from "path";

const appMode = (process.env.NEXT_PUBLIC_APP_MODE ?? 'personal').trim();
const isDemoMode = appMode === 'demo';
const demoAlias: Record<string, string> = isDemoMode
  ? {
    '@/data/cv-data': path.resolve(process.cwd(), 'src/data/cv-data.example.ts'),
  }
  : {};

const nextConfig: NextConfig = {
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
            key: "X-XSS-Protection",
            value: "1; mode=block",
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
