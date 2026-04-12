import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['cukk-be.buatin.com', 'api.cukk-dashboard.com'],
  },
};

export default withNextIntl(nextConfig);
