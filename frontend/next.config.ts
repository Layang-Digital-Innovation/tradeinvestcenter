import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
  // Disable strict mode to prevent double rendering in development
  reactStrictMode: false,
  // Skip ESLint during production builds (prevents lint errors from failing builds)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip TypeScript type checking during production builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure headers to prevent caching issues
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
