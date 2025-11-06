import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
    eslint: {
    ignoreDuringBuilds: true, // ✅ skip linting di build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ optional, kalau mau skip type check juga
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
  // Disable strict mode to prevent double rendering in development
  reactStrictMode: false,
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
