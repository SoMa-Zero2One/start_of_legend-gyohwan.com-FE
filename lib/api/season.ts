import type { SeasonsResponse, EligibilityResponse } from "@/types/season";
import { getBackendUrl } from "@/lib/utils/api";

/**
 * 교환학생 모집 시즌 목록 조회
 * @returns 시즌 목록
 * @throws {Error} API 호출 실패 시
 */
export const getSeasons = async (): Promise<SeasonsResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/seasons`, {
    method: "GET",
    credentials: typeof window !== "undefined" ? "include" : "omit", // 브라우저에서만 쿠키 포함
  });

  if (!response.ok) {
    throw new Error(`시즌 목록 조회 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};

/**
 * 특정 시즌에 대한 지원 가능 여부 확인
 * @param seasonId - 시즌 ID
 * @returns 지원 가능 여부 및 상세 메시지
 * @throws {Error} API 호출 실패 시 (403 포함)
 */
export const checkEligibility = async (seasonId: number): Promise<EligibilityResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/seasons/${seasonId}/eligibility`, {
    method: "GET",
    credentials: "include", // 쿠키 포함
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      detail: errorData.detail || "지원 가능 여부 확인 실패",
      ...errorData,
    };
  }

  return await response.json();
};
