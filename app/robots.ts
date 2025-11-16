import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*", // API 엔드포인트 크롤링 차단
          "/my-page", // 개인 페이지
          "/change-password", // 계정 관리 페이지
          "/delete-account", // 계정 삭제 페이지
          "/school-verification", // 인증 페이지
          "/log-in-or-create-account", // 로그인/회원가입 진입점
          "/log-in/*", // 로그인 플로우
          "/create-account/*", // 회원가입 플로우
          "/create-account-complete", // 회원가입 완료
          "/auth/*", // OAuth 콜백
          "/strategy-room/*/applications/*", // 개인 지원서 (하위 전체)
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
