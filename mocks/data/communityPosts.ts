import type { CommunityPostListResponse } from "@/types/communityPost";

/**
 * 커뮤니티 게시글 Mock 데이터
 */

// 미국 커뮤니티 게시글
export const mockUSCommunityPosts: CommunityPostListResponse = {
  pagination: {
    totalItems: 15,
    totalPages: 2,
    currentPage: 0,
    limit: 10,
  },
  posts: [
    {
      postId: 1,
      title: "2026 봄학기 지원 일정 정리해봤어요 💖",
      content: "학교마다 마감일이 조금씩 달라요. 대사관, 택사스, 오하이오 주 준비하시는 분들은 꼭 참고해세요!",
      createdAt: "2025-01-05T12:34:56.000000",
      author: {
        nickname: "익명",
        isAnonymous: true,
        isMember: true,
      },
      likeCount: 999,
      commentsCount: 999,
      isLiked: false,
    },
    {
      postId: 2,
      title: "ELP 점수 없이 지원 가능한 학교 있을까요?",
      content: "현재 IELTS 준비 중인데 점수 제출 없이 가능한 학교가 있는지 궁금해요??",
      createdAt: "2025-01-04T10:20:30.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 18,
      commentsCount: 6,
      isLiked: false,
    },
    {
      postId: 3,
      title: "오번대 교환 후기 (기숙사, 수업, 음식 등) 🇺🇸",
      content: "봄고래 캠퍼스 다녀왔던 경험 공유드려요. 전반 날씨가 최고였어요!",
      createdAt: "2025-01-03T15:45:12.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 0,
      commentsCount: 0,
      isLiked: false,
    },
    {
      postId: 4,
      title: "2026년 봄학기 미국 교환학생 준비하시는 분 계시나요? 서류...",
      content:
        "안녕하세요 지는 지금 2026년 봄학기 미국 교환학생 지원을 준비 중이에요. 혹시 저처럼 미리 학교 준비하시는 분 있을까요 해서요...",
      createdAt: "2025-01-02T09:15:45.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 0,
      commentsCount: 0,
      isLiked: false,
    },
    {
      postId: 5,
      title: "2025 가을학기 파견자 단톡 오픈했습니다 💬",
      content: "같이 준비하고 정보 나누실 분 환영입니다 :) 준비 과정 중에 도움 많이 받아요!",
      createdAt: "2025-01-01T18:30:22.000000",
      author: {
        nickname: "익명",
        isAnonymous: true,
        isMember: true,
      },
      likeCount: 30,
      commentsCount: 13,
      isLiked: true,
    },
    {
      postId: 6,
      title: "UCLA 기숙사 vs 오프캠퍼스 어디가 나을까요?",
      content: "비용 차이가 꽤 나는데 경험해보신 분들 조언 부탁드립니다!",
      createdAt: "2024-12-30T14:22:10.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 8,
      commentsCount: 4,
      isLiked: true,
    },
  ],
};

// 일본 커뮤니티 게시글
export const mockJPCommunityPosts: CommunityPostListResponse = {
  pagination: {
    totalItems: 8,
    totalPages: 1,
    currentPage: 0,
    limit: 10,
  },
  posts: [
    {
      postId: 101,
      title: "도쿄대 교환학생 생활비 어느 정도 드나요?",
      content: "한 달 생활비 예상해서 준비하려고 하는데 참고할만한 정보 부탁드려요!",
      createdAt: "2025-01-05T14:20:10.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 12,
      commentsCount: 8,
      isLiked: false,
    },
    {
      postId: 102,
      title: "교토 vs 오사카 고민 중입니다",
      content: "둘 다 합격했는데 어디가 더 좋을까요? 경험담 듣고 싶어요",
      createdAt: "2025-01-04T11:30:45.000000",
      author: {
        nickname: "익명",
        isAnonymous: true,
        isMember: true,
      },
      likeCount: 25,
      commentsCount: 15,
      isLiked: false,
    },
    {
      postId: 103,
      title: "와세다대학 기숙사 신청 방법",
      content: "기숙사 신청이 생각보다 복잡하네요... 도와주세요 ㅠㅠ",
      createdAt: "2025-01-03T16:45:30.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 5,
      commentsCount: 3,
      isLiked: false,
    },
  ],
};

// Mock data 매핑
export const mockCommunityPostsByCountry: Record<string, CommunityPostListResponse> = {
  US: mockUSCommunityPosts,
  JP: mockJPCommunityPosts,
};
