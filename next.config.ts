import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [{ type: 'host', value: 'kitaab.me' }],
        destination: 'https://www.kitaab.me/:1',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;