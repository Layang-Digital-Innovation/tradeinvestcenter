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
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    const isProd = process.env.NODE_ENV === 'production';
    // In production, DO NOT fallback to localhost; require BACKEND_URL to be set.
    // In development, fallback to local backend if env not provided.
    const dst = (BACKEND_URL && BACKEND_URL.length > 0)
      ? (BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL)
      : (isProd ? '' : 'http://localhost:3001/api');
    if (!dst) return [];
    const base = dst.endsWith('/api') ? dst : `${dst}/api`;
    return [{ source: '/api/:path*', destination: `${base}/:path*` }];
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
