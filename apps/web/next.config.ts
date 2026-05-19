import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bystend/shared"],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
