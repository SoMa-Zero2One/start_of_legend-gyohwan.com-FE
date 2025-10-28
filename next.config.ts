import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2kydfinz3830f.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
