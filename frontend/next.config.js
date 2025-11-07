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
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    if (BACKEND_URL && BACKEND_URL.length > 0) {
      const dst = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
      const base = dst.endsWith('/api') ? dst : `${dst}/api`;
      return [
        { source: '/api/:path*', destination: `${base}/:path*` },
      ];
    }
    return [];
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