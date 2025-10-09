import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
    };
    return config;
  },
  // Suppress some warnings from external dependencies
  onDemandEntries: {
    // Extend the maximum inactive period for entries (default: 15s)
    maxInactiveAge: 25 * 1000,
  },
};

export default nextConfig;
