/**
 * 커뮤니티 게시글 API 타입 정의
 * API 문서: API_RESPONSE_REFERENCE/COMMUNITY/README.md
 */

export interface Author {
  nickname: string;
  isAnonymous?: boolean;
  isMember?: boolean;
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
