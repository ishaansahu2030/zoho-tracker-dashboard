import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['googleapis'],
  typescript: {
    // Ignore upstream syntax error in googleapis/build/src/apis/workstations/v1.d.ts
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
