import { MetadataRoute } from "next";
import { getSeasons } from "@/lib/api/season";

// 24시간(86400초)마다 재생성 (ISR)
export const revalidate = 86400;

// 마지막으로 성공적으로 생성한 동적 페이지 목록 (런타임 캐시)
let cachedDynamicPages: MetadataRoute.Sitemap | null = null;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gyohwan.com";

  // 정적 페이지들 (검색엔진에 노출되어야 하는 공개 페이지)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1.0, // 홈페이지 최우선
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 동적 페이지들 (전략실 시즌)
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const seasonsData = await getSeasons();

    // 각 시즌별 전략실 페이지 추가 (null 안전 처리)
    const seasons = seasonsData.seasons;

    if (seasons === null) {
      console.warn("[SEO WARNING] sitemap: seasons is null - fallback to cache/static only");
      if (cachedDynamicPages) {
        // 캐시가 있으면 실패를 올려 기존 ISR 캐시 유지
        throw new Error("Seasons is null - reuse previous sitemap");
      }
      // 최초 빌드 등 캐시가 없으면 정적 페이지만 제공
      return staticPages;
    }

    dynamicPages = seasons.map((season) => ({
      url: `${baseUrl}/strategy-room/${season.seasonId}`,
      changeFrequency: "daily" as const,
      priority: 0.8, // 핵심 기능 페이지
    }));

    cachedDynamicPages = dynamicPages;
  } catch (error) {
    console.error("Failed to fetch seasons for sitemap:", error);
    if (cachedDynamicPages) {
      // ISR 캐시가 있으므로 실패를 올려 이전 버전 유지
      throw error;
    }
    // 캐시가 없으면 정적 페이지만 제공 (최초 빌드 등)
    return staticPages;
  }

  // 제외된 페이지들 (robots.txt와 일관성 유지):
  // - /log-in-or-create-account (진입점, 검색 결과 불필요)
  // - /log-in/* (로그인 폼)
  // - /create-account/* (회원가입 폼)
  // - /school-verification (인증 페이지, 로그인 필요)
  // - /my-page (개인 페이지, 로그인 필요)
  // - /change-password (계정 관리, 로그인 필요)
  // - /delete-account (계정 삭제, 로그인 필요)
  // - /auth/* (OAuth 콜백)
  // - /strategy-room/*/applications/* (개인 지원서, 로그인 필요)
  // - /strategy-room/*/slots/* (슬롯 상세, 로그인 필요)

  return [...staticPages, ...dynamicPages];
}
