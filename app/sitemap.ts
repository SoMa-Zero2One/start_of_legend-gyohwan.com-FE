import { MetadataRoute } from 'next';
import { getSeasons } from '@/lib/api/season';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gyohwan.com';

  // 정적 페이지들 (검색엔진에 노출되어야 하는 공개 페이지)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1.0, // 홈페이지 최우선
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 동적 페이지들 (전략실 시즌)
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const seasonsData = await getSeasons();

    // 각 시즌별 전략실 페이지 추가
    dynamicPages = seasonsData.seasons.map((season) => ({
      url: `${baseUrl}/strategy-room/${season.seasonId}`,
      changeFrequency: 'daily' as const,
      priority: 0.8, // 핵심 기능 페이지
    }));
  } catch (error) {
    console.error('Failed to fetch seasons for sitemap:', error);
    // API 실패 시 빈 배열로 처리
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
