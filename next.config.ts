import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "https://portfolio.hungphu.work",
    "https://portfolio-dev.hungphu.work",
  ],
};

export default nextConfig;
