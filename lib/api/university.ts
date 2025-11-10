import type { UniversityDetailResponse } from "@/types/university";
import { getBackendUrl } from "@/lib/utils/api";
import { parseApiError } from "@/lib/utils/apiError";

/**
 * 대학 상세 정보 조회
 * @param univId - 대학 ID (예: 1, 26)
 * @returns 대학 상세 정보
 * @throws {Error} API 호출 실패 시
 */
export const getUniversityDetail = async (univId: number): Promise<UniversityDetailResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/outgoing-universities/${univId}`, {
    method: "GET",
    credentials: "omit", // 인증 불필요
    next: { revalidate: 3600 }, // 1시간마다 캐시 갱신
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};
