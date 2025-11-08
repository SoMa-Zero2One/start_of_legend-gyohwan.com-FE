/**
 * 교환학생 모집 시즌 정보
 */
export interface Season {
  seasonId: number;
  domesticUniversity: string | null;
  domesticUniversityLogoUri: string | null;
  name: string | null;
  startDate: string | null;
  endDate: string | null;
  hasApplied: boolean | null;
}

/**
 * 시즌 목록 조회 응답
 */
export interface SeasonsResponse {
  seasons: Season[] | null;
}

/**
 * 시즌 지원 가능 여부 응답
 */
export interface EligibilityResponse {
  eligible: boolean;
  detail: string;
}
