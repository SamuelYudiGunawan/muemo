import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['i.ytimg.com'],
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

export default nextConfig;
