import type { CountryApiResponse, UniversityApiResponse, PostCreateRequest } from "@/types/community";
import type {
  CommunityPost,
  PostDetailResponse,
  Comment,
  CommentCreateRequest,
  DeleteRequest,
} from "@/types/communityPost";
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

/**
 * 게시글 상세 조회 (GET /v1/community/posts/{postId})
 *
 * USAGE: 게시글 상세 페이지에서 호출됨
 *
 * WHAT: 게시글의 상세 정보와 댓글 목록을 조회하는 API 호출
 *
 * WHY:
 * - 인증 없이도 조회 가능 (credentials: "include"로 로그인 상태는 전송)
 * - 로그인 사용자는 isLiked, isAuthor 값을 받을 수 있음
 * - 댓글 목록도 함께 반환됨
 *
 * @param postId 게시글 ID
 * @returns 게시글 상세 정보 (PostDetailResponse)
 * @throws {Error} API 호출 실패 시 (404: 게시글 없음)
 */
export const getPostDetail = async (postId: number): Promise<PostDetailResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/community/posts/${postId}`, {
    method: "GET",
    credentials: "include", // 로그인 상태 확인을 위한 쿠키 전송
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "게시글을 불러올 수 없습니다." }));
    throw new Error(errorData.detail || "게시글을 불러올 수 없습니다.");
  }

  return await response.json();
};

/**
 * 댓글 작성 (POST /v1/community/posts/{postId}/comments)
 *
 * USAGE: CommentCreateModal에서 호출됨
 *
 * WHAT: 게시글에 댓글을 작성하는 API 호출
 *
 * WHY:
 * - 회원과 비회원 모두 댓글 작성 가능
 * - 회원은 익명 여부를 선택할 수 있음
 * - 비회원은 비밀번호를 통해 추후 삭제 가능
 *
 * @param postId 게시글 ID
 * @param request 댓글 작성 요청 데이터
 * @returns 작성된 댓글 정보 (Comment)
 * @throws {Error} API 호출 실패 시 (400: 유효성 검증 실패, 404: 게시글 없음)
 */
export const createComment = async (postId: number, request: CommentCreateRequest): Promise<Comment> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/community/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 회원 인증을 위한 쿠키 전송
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "댓글 작성에 실패했습니다." }));
    throw new Error(errorData.detail || "댓글 작성에 실패했습니다.");
  }

  return await response.json();
};

/**
 * 댓글 삭제 (DELETE /v1/community/comments/{commentId})
 *
 * USAGE: CommentItem에서 삭제 버튼 클릭 시 호출됨
 *
 * WHAT: 댓글을 삭제하는 API 호출
 *
 * WHY:
 * - 회원 본인 댓글: 비밀번호 없이 삭제 가능
 * - 비회원 댓글: 비밀번호 확인 후 삭제
 *
 * @param commentId 댓글 ID
 * @param password 비회원 댓글 삭제 시 필요한 비밀번호 (선택)
 * @throws {Error} API 호출 실패 시 (401: 비밀번호 불일치, 403: 권한 없음, 404: 댓글 없음)
 */
export const deleteComment = async (commentId: number, password?: string): Promise<void> => {
  const backendUrl = getBackendUrl();

  const body: DeleteRequest | undefined = password ? { password } : undefined;

  const response = await fetch(`${backendUrl}/v1/community/comments/${commentId}`, {
    method: "DELETE",
    headers: body ? { "Content-Type": "application/json" } : {},
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "댓글 삭제에 실패했습니다." }));
    throw new Error(errorData.detail || "댓글 삭제에 실패했습니다.");
  }
};

/**
 * 게시글 삭제 (DELETE /v1/community/posts/{postId})
 *
 * USAGE: PostActionMenu에서 삭제 버튼 클릭 시 호출됨
 *
 * WHAT: 게시글을 삭제하는 API 호출
 *
 * WHY:
 * - 회원 본인 글: 비밀번호 없이 삭제 가능
 * - 비회원 글: 비밀번호 확인 후 삭제
 *
 * @param postId 게시글 ID
 * @param password 비회원 글 삭제 시 필요한 비밀번호 (선택)
 * @throws {Error} API 호출 실패 시 (401: 비밀번호 불일치, 403: 권한 없음, 404: 게시글 없음)
 */
export const deletePost = async (postId: number, password?: string): Promise<void> => {
  const backendUrl = getBackendUrl();

  const body: DeleteRequest | undefined = password ? { password } : undefined;

  const response = await fetch(`${backendUrl}/v1/community/posts/${postId}`, {
    method: "DELETE",
    headers: body ? { "Content-Type": "application/json" } : {},
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "게시글 삭제에 실패했습니다." }));
    throw new Error(errorData.detail || "게시글 삭제에 실패했습니다.");
  }
};
