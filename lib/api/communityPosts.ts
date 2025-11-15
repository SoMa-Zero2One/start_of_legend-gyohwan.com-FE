import type { CommunityPostListResponse } from "@/types/communityPost";
import { getBackendUrl } from "@/lib/utils/api";
import { parseApiError } from "@/lib/utils/apiError";

/**
 * USAGE: 국가별 커뮤니티 게시글 목록 조회
 *
 * WHAT: GET /v1/community/posts?countryCode={code}&page={page}&limit={limit}
 *
 * WHY:
 * - 국가 상세 페이지에서 해당 국가의 커뮤니티 글 표시
 * - cache: "no-store" 사용 → 실시간성 보장 (SEO 유지)
 * - ⚠️ 주의: no-store는 페이지 전체 ISR을 무력화함
 *   (같은 페이지의 다른 fetch에 revalidate가 있어도 무시됨)
 * - 트레이드오프: 커뮤니티 실시간성 > 캐싱 효율
 *
 * ALTERNATIVES:
 * - revalidate: 300 (rejected: 커뮤니티 실시간성 중요)
 * - 클라이언트 fetch (rejected: SEO 손실)
 *
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

  const queryParams = new URLSearchParams({
    countryCode,
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${backendUrl}/v1/community/posts?${queryParams}`, {
    method: "GET",
    cache: "no-store", // 실시간성 우선 (페이지 전체 동적 렌더링)
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
 * WHAT: GET /v1/community/posts?outgoingUnivId={univId}&page={page}&limit={limit}
 *
 * WHY:
 * - 대학 상세 페이지에서 해당 대학의 커뮤니티 글 표시
 * - outgoingUnivId는 camelCase (API 문서 스펙)
 * - page, limit 파라미터 사용 (API 스펙)
 * - cache: "no-store" 사용 → 실시간성 보장 (SEO 유지)
 * - ⚠️ 주의: no-store는 페이지 전체 ISR을 무력화함
 *   (같은 페이지의 다른 fetch에 revalidate가 있어도 무시됨)
 * - 트레이드오프: 커뮤니티 실시간성 > 캐싱 효율
 *
 * ALTERNATIVES:
 * - snake_case 사용 (rejected: API 문서가 camelCase 명시)
 * - offset 계산 (rejected: API가 page를 직접 받음)
 * - revalidate: 300 (rejected: 커뮤니티 실시간성 중요)
 * - 클라이언트 fetch (rejected: SEO 손실)
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

  const queryParams = new URLSearchParams({
    outgoingUnivId: univId.toString(),
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${backendUrl}/v1/community/posts?${queryParams}`, {
    method: "GET",
    cache: "no-store", // 실시간성 우선 (페이지 전체 동적 렌더링)
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * USAGE: 게시글 좋아요 등록
 *
 * WHAT: POST /v1/community/posts/{postId}/like
 *
 * WHY:
 * - 사용자가 게시글에 좋아요를 누를 때 사용
 * - credentials: "include" 필수 (세션 쿠키로 사용자 인증)
 * - 서버에서 좋아요 상태 저장
 *
 * ALTERNATIVES:
 * - 낙관적 업데이트 (rejected: 우선 기본 구현)
 *
 * @param postId - 게시글 ID
 * @throws {Error} API 호출 실패 시
 */
export const likePost = async (postId: number): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/community/posts/${postId}/like`, {
    method: "POST",
    credentials: "include", // 세션 쿠키 포함
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }
};

/**
 * USAGE: 게시글 좋아요 취소
 *
 * WHAT: DELETE /v1/community/posts/{postId}/like
 *
 * WHY:
 * - 사용자가 좋아요를 취소할 때 사용
 * - credentials: "include" 필수 (세션 쿠키로 사용자 인증)
 * - 서버에서 좋아요 상태 제거
 *
 * ALTERNATIVES:
 * - 낙관적 업데이트 (rejected: 우선 기본 구현)
 *
 * @param postId - 게시글 ID
 * @throws {Error} API 호출 실패 시
 */
export const unlikePost = async (postId: number): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/community/posts/${postId}/like`, {
    method: "DELETE",
    credentials: "include", // 세션 쿠키 포함
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }
};
