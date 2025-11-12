import type { CountryApiResponse, UniversityApiResponse, PostCreateRequest } from "@/types/community";
import type { CommunityPost } from "@/types/communityPost";
import { getBackendUrl } from "@/lib/utils/api";

/**
 * 나라 목록 조회 (GET /v1/windows/countries)
 * @returns 나라 목록 (동적 필드 포함)
 * @throws {Error} API 호출 실패 시
 */
export const fetchCountries = async (): Promise<CountryApiResponse[]> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/countries`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`나라 목록 조회 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};

/**
 * 대학 목록 조회 - 공개용 (인증 불필요)
 * SEO 최적화를 위해 서버 사이드에서 사용
 * 쿠키 없이 호출하므로 isFavorite은 모두 false로 반환됨
 *
 * @returns 대학 목록 (동적 필드 포함, isFavorite은 모두 false)
 * @throws {Error} API 호출 실패 시
 */
export const fetchUniversitiesPublic = async (): Promise<UniversityApiResponse[]> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/outgoing-universities`, {
    method: "GET",
    credentials: "omit",
  });

  if (!response.ok) {
    throw new Error(`대학 목록 조회 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};

/**
 * 대학 목록 조회 - 인증용 (쿠키 필요)
 * 클라이언트 사이드에서 사용, 로그인 유저의 즐겨찾기 정보 포함
 * 브라우저 쿠키를 전송하여 사용자별 isFavorite 값을 가져옴
 *
 * @returns 대학 목록 (동적 필드 포함, isFavorite 실제 값)
 * @throws {Error} API 호출 실패 시
 */
export const fetchUniversities = async (): Promise<UniversityApiResponse[]> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/outgoing-universities`, {
    method: "GET",
    credentials: "include", // 로그인 상태 확인을 위한 쿠키 전송
  });

  if (!response.ok) {
    throw new Error(`대학 목록 조회 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};

/**
 * 즐겨찾기 추가 (POST /v1/windows/outgoing-universities/{univId}/favorite)
 * @param univId 대학 ID
 * @throws {Error} API 호출 실패 시
 */
export const addFavorite = async (univId: number): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/outgoing-universities/${univId}/favorite`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`즐겨찾기 추가 실패 (HTTP ${response.status})`);
  }
};

/**
 * 즐겨찾기 삭제 (DELETE /v1/windows/outgoing-universities/{univId}/favorite)
 * @param univId 대학 ID
 * @throws {Error} API 호출 실패 시
 */
export const removeFavorite = async (univId: number): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/outgoing-universities/${univId}/favorite`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`즐겨찾기 삭제 실패 (HTTP ${response.status})`);
  }
};

/**
 * 커뮤니티 게시글 작성 (POST /v1/community/posts)
 *
 * USAGE: PostCreateModal에서 호출됨
 *
 * WHAT: 커뮤니티 게시글을 작성하는 API 호출
 *
 * WHY:
 * - 회원과 비회원 모두 게시글 작성 가능
 * - 회원은 익명 여부를 선택할 수 있음
 * - 비회원은 비밀번호를 통해 추후 수정/삭제 가능
 *
 * @param request 게시글 작성 요청 데이터
 * @returns 작성된 게시글 정보 (PostDetailResponse)
 * @throws {Error} API 호출 실패 시 (400: 유효성 검증 실패, 401: 인증 실패, 404: 리소스 없음)
 */
export const createPost = async (request: PostCreateRequest): Promise<CommunityPost> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/community/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 회원 인증을 위한 쿠키 전송
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    // 백엔드에서 ProblemDetail 형식으로 에러 반환
    const errorData = await response.json().catch(() => ({ detail: "게시글 작성에 실패했습니다." }));
    throw new Error(errorData.detail || "게시글 작성에 실패했습니다.");
  }

  return await response.json();
};
