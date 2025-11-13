/**
 * 커뮤니티 게시글 API 타입 정의
 * API 문서: API_RESPONSE_REFERENCE/COMMUNITY/README.md
 */

export interface Author {
  nickname: string;
  isAnonymous?: boolean;
  isMember?: boolean;
  isAuthor?: boolean; // 현재 로그인한 사용자가 작성자인지 (본인 글이면 true)
}

export interface CommunityPost {
  postId: number;
  title: string;
  content: string;
  createdAt: string; // ISO 8601 format: "2025-01-05T12:34:56.000000"
  author: Author;
  likeCount: number;
  commentsCount: number;
  isLiked: boolean; // 로그인 사용자가 좋아요 눌렀는지 (미로그인 시 false)
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface CommunityPostListResponse {
  pagination: Pagination;
  posts: CommunityPost[];
  countryName?: string | null; // 국가 커뮤니티일 때 (방어적 타입)
  outgoingUnivName?: string | null; // 대학 커뮤니티일 때 (방어적 타입)
}

/**
 * 댓글 정보 (방어적 타입 - ID 제외 모두 nullable)
 */
export interface Comment {
  commentId: number;
  content?: string | null;
  createdAt?: string | null; // ISO 8601 format
  author?: Author | null;
}

/**
 * 게시글 상세 정보 (댓글 포함, 방어적 타입)
 */
export interface PostDetailResponse {
  postId: number;
  title?: string | null;
  content?: string | null;
  createdAt?: string | null;
  author?: Author | null;
  likeCount?: number | null;
  isLiked?: boolean | null;
  comments?: Comment[] | null;
}

/**
 * 댓글 작성 요청
 */
export interface CommentCreateRequest {
  content: string;
  isAnonymous?: boolean; // 회원만 사용 가능
  guestPassword?: string; // 비회원 필수
}

/**
 * 비회원 삭제 요청 (비밀번호 확인용)
 */
export interface DeleteRequest {
  password: string;
}
