import type { UniversityDetailResponse } from "@/types/university";
import { getBackendUrl } from "@/lib/utils/api";
import { parseApiError } from "@/lib/utils/apiError";

/**
 * USAGE: 대학 상세 정보 조회
 *
 * WHAT: GET /v1/windows/outgoing-universities/{univId}
 *
 * WHY:
 * - 대학 상세 페이지에서 사용
 * - cache: "no-store" 사용 → 커뮤니티 API와 동일한 캐시 전략
 * - ⚠️ 동일 페이지에서 커뮤니티 API(no-store)와 함께 호출되므로
 *   revalidate를 설정해도 무시됨 (페이지 전체가 동적 렌더링)
 * - 명시적으로 no-store 사용하여 혼란 방지
 *
 * ALTERNATIVES:
 * - revalidate: 3600 (rejected: 커뮤니티 no-store에 의해 무시됨)
 *
 * @param univId - 대학 ID (예: 1, 26)
 * @returns 대학 상세 정보
 * @throws {Error} API 호출 실패 시
 */
export const getUniversityDetail = async (univId: number): Promise<UniversityDetailResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/outgoing-universities/${univId}`, {
    method: "GET",
    credentials: "omit", // 인증 불필요
    cache: "no-store", // 페이지 전체 동적 렌더링 (커뮤니티 API와 일관성)
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};
