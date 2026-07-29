import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Disable turbopack to avoid build issues on Vercel */
  experimental: {
    turbo: false,
  },
  /* Other config options */
};

export default nextConfig;
