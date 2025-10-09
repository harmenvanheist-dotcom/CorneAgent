import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Netlify deployment with API routes
  images: {
    unoptimized: true
  },
  
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
    };
    return config;
  },
};

export default nextConfig;
