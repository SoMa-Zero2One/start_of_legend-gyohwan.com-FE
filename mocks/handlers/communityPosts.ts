import { http, HttpResponse } from "msw";
import { mockCommunityPostsByCountry, mockCommunityPostsByUniversity } from "../data/communityPosts";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const communityPostsHandlers = [
  // GET /v1/community/posts - 국가별/대학별 커뮤니티 게시글 목록 조회
  http.get(`${BACKEND_URL}/v1/community/posts`, ({ request }) => {
    const url = new URL(request.url);
    const countryCode = url.searchParams.get("countryCode");
    const outgoingUnivId = url.searchParams.get("outgoingUnivId"); // ← camelCase
    const page = parseInt(url.searchParams.get("page") || "0"); // ← page 파라미터
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // countryCode와 outgoingUnivId 둘 다 없으면 400 에러
    if (!countryCode && !outgoingUnivId) {
      return HttpResponse.json(
        { detail: "countryCode 또는 outgoingUnivId를 입력해주세요." },
        { status: 400 }
      );
    }

    let mockData;

    // 대학별 조회
    if (outgoingUnivId) {
      const univId = parseInt(outgoingUnivId);
      mockData = mockCommunityPostsByUniversity[univId];

      if (!mockData) {
        return HttpResponse.json({ detail: "대학을 찾을 수 없습니다." }, { status: 404 });
      }
    }
    // 국가별 조회
    else if (countryCode) {
      const upperCountryCode = countryCode.toUpperCase();
      mockData = mockCommunityPostsByCountry[upperCountryCode];

      if (!mockData) {
        return HttpResponse.json({ detail: "국가를 찾을 수 없습니다." }, { status: 404 });
      }
    }

    // 페이지네이션 처리 (page 기반)
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = mockData!.posts.slice(startIndex, endIndex);

    return HttpResponse.json({
      pagination: {
        ...mockData!.pagination,
        currentPage: page,
        limit,
      },
      posts: paginatedPosts,
    });
  }),
];
