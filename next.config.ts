import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
