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
export const getCommunityPosts = async (
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
    credentials: "include", // 로그인 사용자의 isLiked 정보 포함
    cache: "no-store", // 캐싱 안 함 (사용자가 글 작성 후 즉시 반영)
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};
