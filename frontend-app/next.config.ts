import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // ✅ Enables React strict mode (recommended)
  swcMinify: true, // ✅ Enables SWC for faster builds
  experimental: {}, // ✅ Empty, since `appDir` is no longer needed here
};

export default nextConfig;
