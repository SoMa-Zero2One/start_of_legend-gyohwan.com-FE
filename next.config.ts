import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // instrumentation.ts는 Next.js 15.5+에서 기본 활성화됨 (MSW Server 초기화용)
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
