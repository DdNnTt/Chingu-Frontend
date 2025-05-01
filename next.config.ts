import type { NextConfig } from 'next';

const API_BASE = process.env.API_BASE_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/users/:path*',
        destination: `${API_BASE}/api/users/:path*`,
      },
    ];
  },
};

export default nextConfig;
