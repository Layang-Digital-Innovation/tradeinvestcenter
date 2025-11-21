import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    // Prefer public API base for stability in production
    // Falls back to internal backend URL, then local dev.
    const RAW_BACKEND = process.env.NEXT_PUBLIC_API_URL
      || process.env.NEXT_PUBLIC_BACKEND_URL
      || process.env.BACKEND_URL
      || 'http://localhost:3001';
    const dst = RAW_BACKEND.endsWith('/') ? RAW_BACKEND.slice(0, -1) : RAW_BACKEND;
    const base = dst.endsWith('/api') ? dst : `${dst}/api`;
    return [
      { source: '/api/:path*', destination: `${base}/:path*` },
    ];
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
