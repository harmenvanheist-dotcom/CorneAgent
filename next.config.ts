import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for better Netlify compatibility
  output: 'export',
  trailingSlash: true,
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
