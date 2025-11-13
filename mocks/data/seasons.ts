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
    applicationCount: 42,
    startDate: "2024-12-01T00:00:00",
    endDate: "2025-01-15T23:59:59",
    hasApplied: false,
  },
  {
    seasonId: 2,
    domesticUniversity: "교환대학교",
    domesticUniversityLogoUri: "https://example.com/logo1.png",
    name: "2025년 2학기",
    applicationCount: 28,
    startDate: "2025-06-01T00:00:00",
    endDate: "2025-07-15T23:59:59",
    hasApplied: false,
  },
  {
    seasonId: 3,
    domesticUniversity: "교환대학교",
    domesticUniversityLogoUri: "https://example.com/logo1.png",
    name: "2026년 1학기",
    applicationCount: 65,
    startDate: "2025-12-01T00:00:00",
    endDate: "2026-01-15T23:59:59",
    hasApplied: true, // 이미 지원한 시즌
  },
  {
    seasonId: 4,
    domesticUniversity: "다른대학교",
    domesticUniversityLogoUri: "https://example.com/logo2.png",
    name: "2025년 1학기",
    applicationCount: 15,
    startDate: "2024-12-01T00:00:00",
    endDate: "2025-01-15T23:59:59",
    hasApplied: false,
  },
  // 방어적 코딩 테스트용: null 필드를 가진 시즌
  {
    seasonId: 5,
    domesticUniversity: null, // null 케이스
    domesticUniversityLogoUri: null, // null 케이스
    name: null, // null 케이스
    applicationCount: null, // null 케이스
    startDate: null,
    endDate: null,
    hasApplied: null, // null 케이스
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
  5: 0, // null 필드 테스트용 시즌
};
