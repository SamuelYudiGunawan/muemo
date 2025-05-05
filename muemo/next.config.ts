import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['i.ytimg.com', 'www.google.com'],
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://muemo-backend-950251872768.us-central1.run.app/:path*',
        // destination: 'http://127.0.0.1:8080/:path*',
      },
    ];
  },
};

export default nextConfig;
