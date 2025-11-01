import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://gyohwan.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // API 엔드포인트 크롤링 차단
          "/my-page", // 개인 페이지
          "/change-password", // 계정 관리 페이지
          "/delete-account", // 계정 삭제 페이지
          "/school-verification", // 인증 페이지
          "/create-account/", // 회원가입 플로우
          "/log-in/", // 로그인 플로우
          "/auth/", // OAuth 콜백
          "/strategy-room/*/applications/", // 개인 지원서
          "/strategy-room/*/slots/", // 슬롯 상세 (로그인 필요)
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
