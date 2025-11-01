import type { Season } from "@/types/season";

/**
 * Mock 시즌 데이터
 */

export const mockSeasons: Season[] = [
  {
    seasonId: 1,
    domesticUniversity: "교환대학교",
    domesticUniversityLogoUri: "https://example.com/logo1.png",
    name: "2025년 1학기",
    startDate: "2024-12-01T00:00:00",
    endDate: "2025-01-15T23:59:59",
    hasApplied: false,
  },
  {
    seasonId: 2,
    domesticUniversity: "교환대학교",
    domesticUniversityLogoUri: "https://example.com/logo1.png",
    name: "2025년 2학기",
    startDate: "2025-06-01T00:00:00",
    endDate: "2025-07-15T23:59:59",
    hasApplied: false,
  },
  {
    seasonId: 3,
    domesticUniversity: "교환대학교",
    domesticUniversityLogoUri: "https://example.com/logo1.png",
    name: "2026년 1학기",
    startDate: "2025-12-01T00:00:00",
    endDate: "2026-01-15T23:59:59",
    hasApplied: true, // 이미 지원한 시즌
  },
  {
    seasonId: 4,
    domesticUniversity: "다른대학교",
    domesticUniversityLogoUri: "https://example.com/logo2.png",
    name: "2025년 1학기",
    startDate: "2024-12-01T00:00:00",
    endDate: "2025-01-15T23:59:59",
    hasApplied: false,
  },
];

/**
 * 시즌 ID로 시즌 찾기
 */
export function findSeasonById(seasonId: number): Season | undefined {
  return mockSeasons.find((s) => s.seasonId === seasonId);
}

/**
 * 시즌별 지원자 수 (mock)
 */
export const mockSeasonApplicantCounts: Record<number, number> = {
  1: 42,
  2: 28,
  3: 65,
  4: 15,
};
