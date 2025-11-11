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
    {
      postId: 7,
      title: "뉴욕 vs LA 어디가 살기 좋을까요?",
      content: "둘 다 합격했는데 고민이 되네요. 생활비, 교통 등 비교 부탁드려요!",
      createdAt: "2024-12-29T10:15:30.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 15,
      commentsCount: 8,
      isLiked: false,
    },
    {
      postId: 8,
      title: "미국 교환 중 여행 추천해주세요!",
      content: "방학 때 여행 계획 중인데 꼭 가봐야 할 곳 추천 부탁드립니다",
      createdAt: "2024-12-28T16:30:45.000000",
      author: {
        nickname: "익명",
        isAnonymous: true,
        isMember: true,
      },
      likeCount: 42,
      commentsCount: 20,
      isLiked: false,
    },
    {
      postId: 9,
      title: "미국 은행 계좌 개설 팁",
      content: "Chase vs Bank of America 어디가 좋을까요? 수수료 비교해봤어요",
      createdAt: "2024-12-27T09:20:10.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 28,
      commentsCount: 12,
      isLiked: true,
    },
    {
      postId: 10,
      title: "교환학생 보험 어떤 거 드셨나요?",
      content: "학교 보험 vs 개인 보험 고민 중입니다",
      createdAt: "2024-12-26T14:45:20.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 10,
      commentsCount: 5,
      isLiked: false,
    },
    {
      postId: 11,
      title: "미국 심카드 추천해주세요",
      content: "T-Mobile, Verizon, AT&T 중에 어디가 괜찮나요?",
      createdAt: "2024-12-25T11:30:15.000000",
      author: {
        nickname: "익명",
        isAnonymous: true,
        isMember: true,
      },
      likeCount: 22,
      commentsCount: 15,
      isLiked: false,
    },
    {
      postId: 12,
      title: "미국 교환학생 준비물 체크리스트",
      content: "출국 전 꼭 챙겨야 할 것들 정리해봤어요!",
      createdAt: "2024-12-24T13:20:30.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 67,
      commentsCount: 28,
      isLiked: true,
    },
    {
      postId: 13,
      title: "미국 대학 수업 분위기 어떤가요?",
      content: "한국이랑 많이 다른가요? 궁금합니다",
      createdAt: "2024-12-23T10:15:45.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 18,
      commentsCount: 11,
      isLiked: false,
    },
    {
      postId: 14,
      title: "교환학생 중 인턴 구하기",
      content: "방학 때 미국에서 인턴 경험 쌓고 싶은데 가능할까요?",
      createdAt: "2024-12-22T15:40:20.000000",
      author: {
        nickname: "익명",
        isAnonymous: true,
        isMember: true,
      },
      likeCount: 35,
      commentsCount: 16,
      isLiked: false,
    },
    {
      postId: 15,
      title: "미국 교환 마치고 돌아왔습니다",
      content: "정말 최고의 경험이었어요. 궁금한 거 있으면 물어보세요!",
      createdAt: "2024-12-21T12:30:10.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 89,
      commentsCount: 42,
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

// 대학별 커뮤니티 게시글 - University ID 1 (UTC)
export const mockUTCCommunityPosts: CommunityPostListResponse = {
  pagination: {
    totalItems: 24,
    totalPages: 3,
    currentPage: 1,
    limit: 10,
  },
  posts: [
    {
      postId: 201,
      title: "UTC 기숙사 질문있어요!",
      content: "기숙사 신청은 언제부터 가능한가요? 그리고 싱글룸이 있나요??",
      createdAt: "2025-01-06T10:15:30.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 5,
      commentsCount: 3,
      isLiked: false,
    },
    {
      postId: 202,
      title: "UTC 날씨 어떤가요?",
      content: "겨울에 많이 추운지 궁금해요. 어떤 옷 준비해야 할까요?",
      createdAt: "2025-01-05T14:22:10.000000",
      author: {
        nickname: "익명",
        isAnonymous: true,
        isMember: true,
      },
      likeCount: 12,
      commentsCount: 8,
      isLiked: false,
    },
    {
      postId: 203,
      title: "UTC 수강신청 팁 공유합니다!",
      content: "작년에 다녀온 선배입니다. 수강신청할 때 이것만은 꼭 참고하세요!",
      createdAt: "2025-01-04T09:30:45.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 45,
      commentsCount: 18,
      isLiked: true,
    },
    {
      postId: 204,
      title: "UTC 근처 맛집 추천해주세요",
      content: "학교 주변에 괜찮은 식당 있을까요?",
      createdAt: "2025-01-03T16:45:20.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 8,
      commentsCount: 12,
      isLiked: false,
    },
    {
      postId: 205,
      title: "UTC 교환 준비 체크리스트",
      content: "출국 전 준비물 정리해봤어요. 도움이 되길 바랍니다!",
      createdAt: "2025-01-02T11:20:15.000000",
      author: {
        nickname: "익명",
        isAnonymous: true,
        isMember: true,
      },
      likeCount: 67,
      commentsCount: 24,
      isLiked: true,
    },
  ],
};

// 대학별 커뮤니티 게시글 - University ID 2 (도쿄대)
export const mockTokyoUnivCommunityPosts: CommunityPostListResponse = {
  pagination: {
    totalItems: 18,
    totalPages: 2,
    currentPage: 1,
    limit: 10,
  },
  posts: [
    {
      postId: 301,
      title: "도쿄대 봄학기 지원했어요!",
      content: "같이 지원하신 분들 계시나요? 정보 공유해요 🌸",
      createdAt: "2025-01-06T12:30:20.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 22,
      commentsCount: 14,
      isLiked: false,
    },
    {
      postId: 302,
      title: "도쿄대 일본어 수업 난이도",
      content: "JLPT N2 정도면 수업 따라갈 수 있을까요?",
      createdAt: "2025-01-05T15:45:10.000000",
      author: {
        nickname: "익명",
        isAnonymous: true,
        isMember: true,
      },
      likeCount: 18,
      commentsCount: 9,
      isLiked: false,
    },
    {
      postId: 303,
      title: "도쿄대 교환 후기 (생활비, 교통, 문화)",
      content: "작년 가을학기 다녀온 후기입니다. 궁금한 거 있으면 댓글 남겨주세요!",
      createdAt: "2025-01-04T10:20:30.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 89,
      commentsCount: 35,
      isLiked: true,
    },
    {
      postId: 304,
      title: "도쿄대 근처 저렴한 숙소 추천",
      content: "기숙사 떨어져서 자취방 알아보는 중인데 추천 부탁드려요",
      createdAt: "2025-01-03T14:15:45.000000",
      author: {
        nickname: "익명",
        isAnonymous: false,
        isMember: true,
      },
      likeCount: 15,
      commentsCount: 11,
      isLiked: false,
    },
  ],
};

// Mock data 매핑
export const mockCommunityPostsByCountry: Record<string, CommunityPostListResponse> = {
  US: mockUSCommunityPosts,
  JP: mockJPCommunityPosts,
};

export const mockCommunityPostsByUniversity: Record<number, CommunityPostListResponse> = {
  1: mockUTCCommunityPosts, // UTC
  2: mockTokyoUnivCommunityPosts, // 도쿄대
};
