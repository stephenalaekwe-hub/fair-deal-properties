import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'geolocation=(self), camera=(), microphone=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    agentUpgrade: 'security' as any,
  },
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async redirects() {
    // legacy single-page-application routes from website versions 1 to 5
    return [
      { source: '/opportunities', destination: '/marketplace', permanent: true },
      { source: '/inspect', destination: '/inspections', permanent: true },
      { source: '/howitworks', destination: '/how-it-works', permanent: true },
      { source: '/privacy', destination: '/privacy-notice', permanent: true },
      { source: '/cookies', destination: '/cookie-notice', permanent: true },
      { source: '/rights', destination: '/data-rights', permanent: true },
      { source: '/home', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
