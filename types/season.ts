/**
 * 교환학생 모집 시즌 정보
 */
export interface Season {
  seasonId: number;
  domesticUniversity: string;
  domesticUniversityLogoUri: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  hasApplied: boolean;
}

/**
 * 시즌 목록 조회 응답
 */
export interface SeasonsResponse {
  seasons: Season[];
}
