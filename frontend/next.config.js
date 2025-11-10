/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip TypeScript type checking during production builds
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    // Prefer internal backend URL for server-side proxy to avoid Traefik loop
    const RAW_BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL
      || process.env.BACKEND_URL
      || 'http://localhost:3001';
    const dst = RAW_BACKEND.endsWith('/') ? RAW_BACKEND.slice(0, -1) : RAW_BACKEND;
    const base = dst.endsWith('/api') ? dst : `${dst}/api`;
    return [{ source: '/api/:path*', destination: `${base}/:path*` }];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;