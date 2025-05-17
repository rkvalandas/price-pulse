import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: "dist",
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.ssl-images-amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.amazon.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.flipkart.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.walmart.com",
        pathname: "/**",
      },
    ],
  },
  // Add your environment variables here if needed at build time
  env: {
    // BUILD_TIME_VAR: process.env.BUILD_TIME_VAR,
  },
};

export default nextConfig;