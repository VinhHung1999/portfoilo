import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin root: a stray ~/package-lock.json makes Next nest the standalone output
  outputFileTracingRoot: path.join(__dirname),
  allowedDevOrigins: [
    "https://portfolio.hungphu.work",
    "https://portfolio-dev.hungphu.work",
  ],
};

export default nextConfig;
