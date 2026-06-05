import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['cukk-be.buatin.com', 'api.cukk-dashboard.com'],
  },
  // Disable ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Generate unique build ID to prevent chunk loading errors
  generateBuildId: async () => {
    // Use timestamp to ensure each build has a unique ID
    return `build-${Date.now()}`;
  },
  // Configure output to avoid cache issues
  output: 'standalone',
  // Add cache control headers.
  // NOTE: '/_next/static/:path*' must come AFTER '/(.*)?'
  // so it overrides to immutable for hashed static assets.
  async headers() {
    return [
      {
        // '/(.*)?'  matches ALL routes including root '/'
        // '/:path*' misses root '/' which caused s-maxage=31536000 on HTML
        source: '/(.*)?',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        // Override for hashed chunks/assets — these are safe to cache forever
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
