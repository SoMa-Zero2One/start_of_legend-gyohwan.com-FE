import type { CommunityPostListResponse } from "@/types/communityPost";
import { getBackendUrl } from "@/lib/utils/api";
import { parseApiError } from "@/lib/utils/apiError";

/**
 * 국가별 커뮤니티 게시글 목록 조회
 * @param countryCode - 국가 코드 (예: "US", "JP")
 * @param options - 페이지네이션 옵션
 * @returns 게시글 목록 및 페이지네이션 정보
 * @throws {Error} API 호출 실패 시
 */
export const getCountryCommunityPosts = async (
  countryCode: string,
  options?: { page?: number; limit?: number }
): Promise<CommunityPostListResponse> => {
  const backendUrl = getBackendUrl();
  const { page = 0, limit = 10 } = options || {};

  // offset 계산 (page * limit)
  const offset = page * limit;

  const queryParams = new URLSearchParams({
    countryCode,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`${backendUrl}/v1/community/posts?${queryParams}`, {
    method: "GET",
    cache: "no-store", // 캐싱 안 함 (사용자가 글 작성 후 즉시 반영)
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * USAGE: 대학별 커뮤니티 게시글 목록 조회
 *
 * WHAT: GET /v1/community/posts?outgoing_univ_id={univId}&limit={limit}&offset={offset}
 *
 * WHY:
 * - 대학 상세 페이지에서 해당 대학의 커뮤니티 글 표시
 * - page, limit 사용하지만 API는 offset으로 변환
 * - limit = 10 (모바일 최적화)
 * - no-store 캐싱으로 최신 글 즉시 반영
 *
 * ALTERNATIVES:
 * - offset 직접 사용 (rejected: page가 더 직관적)
 * - limit = 20 (rejected: 모바일에서 초기 로딩 느림)
 * - 캐싱 사용 (rejected: 실시간 커뮤니티 특성상 no-store 필요)
 *
 * @param univId - 대학 ID
 * @param options - 페이지네이션 옵션 (page, limit)
 * @returns 게시글 목록 및 페이지네이션 정보
 * @throws {Error} API 호출 실패 시
 */
export const getUniversityCommunityPosts = async (
  univId: number,
  options?: { page?: number; limit?: number }
): Promise<CommunityPostListResponse> => {
  const backendUrl = getBackendUrl();
  const { page = 0, limit = 10 } = options || {};

  // offset 계산 (page * limit)
  const offset = page * limit;

  const queryParams = new URLSearchParams({
    outgoing_univ_id: univId.toString(),
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`${backendUrl}/v1/community/posts?${queryParams}`, {
    method: "GET",
    cache: "no-store", // 캐싱 안 함 (사용자가 글 작성 후 즉시 반영)
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};
