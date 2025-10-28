import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2kydfinz3830f.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "example.com", // MSW Mock 데이터용
      },
    ],
  },
};

export default nextConfig;
