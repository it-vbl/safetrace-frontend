import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['highlandindonesia.com', '127.0.0.1', 'localhost', 'poc-jasindo.digiform.co.id'],
  },
};

export default withNextIntl(nextConfig);
