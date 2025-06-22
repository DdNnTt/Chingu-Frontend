/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
  images: {
    domains: ['chingu-album.s3.ap-northeast-2.amazonaws.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/users/:path*',
        destination: `${process.env.API_BASE_URL}/api/users/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
