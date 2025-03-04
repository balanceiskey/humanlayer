import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // Add webpack configuration for better hot reloading
  webpack: (config, { isServer }) => {
    // For hot reloading to work properly in Docker
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  // Configure allowed image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'platform.slack-edge.com',
        pathname: '/img/**',
      },
    ],
  },
};

export default nextConfig;
