import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: (process.env.NEXT_PUBLIC_IMAGE_DOMAIN || '')
      .split(',')
      .map((domain) => domain.trim())
      .filter(Boolean),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)?',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
