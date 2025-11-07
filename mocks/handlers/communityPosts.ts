import { http, HttpResponse } from "msw";
import { mockCommunityPostsByCountry } from "../data/communityPosts";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const communityPostsHandlers = [
  // GET /v1/community/posts - 국가별 커뮤니티 게시글 목록 조회
  http.get(`${BACKEND_URL}/v1/community/posts`, ({ request }) => {
    const url = new URL(request.url);
    const countryCode = url.searchParams.get("countryCode");
    const page = parseInt(url.searchParams.get("page") || "0");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // countryCode 없으면 400 에러
    if (!countryCode) {
      return HttpResponse.json(
        { detail: "countryCode 또는 outgoingUnivId를 입력해주세요." },
        { status: 400 }
      );
    }

    const upperCountryCode = countryCode.toUpperCase();
    const mockData = mockCommunityPostsByCountry[upperCountryCode];

    // 존재하지 않는 국가 코드면 404
    if (!mockData) {
      return HttpResponse.json({ detail: "국가를 찾을 수 없습니다." }, { status: 404 });
    }

    // 페이지네이션 처리
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = mockData.posts.slice(startIndex, endIndex);

    return HttpResponse.json({
      pagination: {
        ...mockData.pagination,
        currentPage: page,
        limit,
      },
      posts: paginatedPosts,
    });
  }),
];
