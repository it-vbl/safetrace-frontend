import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cukk-be.buatin.com'],
  },
};

export default withNextIntl(nextConfig);
