import { MetadataRoute } from 'next';
import { getSeasons } from '@/lib/api/season';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gyohwan.com';

  // 정적 페이지들 (검색엔진에 노출되어야 하는 공개 페이지)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // 홈페이지 최우선
    },
    {
      url: `${baseUrl}/log-in-or-create-account`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
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
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8, // 핵심 기능 페이지
    }));
  } catch (error) {
    console.error('Failed to fetch seasons for sitemap:', error);
    // API 실패 시 빈 배열로 처리
  }

  // 제외할 페이지들 (robots meta tag로 제어되는 페이지):
  // - /log-in/password (noindex)
  // - /create-account/password (noindex)
  // - /create-account-complete (noindex)
  // - /school-verification (noindex, 로그인 필요)
  // - /my-page (noindex, 로그인 필요)
  // - /change-password (noindex, 로그인 필요)
  // - /delete-account (noindex, 로그인 필요)
  // - /auth/[provider]/callback (noindex, OAuth 콜백)
  // - /strategy-room/[seasonId]/applications/* (noindex, 로그인 필요)
  // - /strategy-room/[seasonId]/slots/[slotId] (noindex, 로그인 필요)

  return [...staticPages, ...dynamicPages];
}
