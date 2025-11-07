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
    // If BACKEND_URL is set (e.g., https://api.tradeinvestcenter.com or http://backend:3001/api),
    // proxy `/api/*` to that backend target. This fixes 404 when Next handles `/api`.
    if (BACKEND_URL && BACKEND_URL.length > 0) {
      // Ensure no trailing slash duplication
      const dst = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
      // Ensure backend path includes '/api' if server uses global prefix
      const base = dst.endsWith('/api') ? dst : `${dst}/api`;
      return [
        { source: '/api/:path*', destination: `${base}/:path*` },
      ];
    }
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
