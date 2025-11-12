import { http, HttpResponse } from "msw";
import { mockCommunityPostsByCountry, mockCommunityPostsByUniversity, createMockPost } from "../data/communityPosts";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const communityPostsHandlers = [
  // POST /v1/community/posts - 커뮤니티 게시글 작성
  http.post(`${BACKEND_URL}/v1/community/posts`, async ({ request }) => {
    const body = await request.json();
    const { title, content, isAnonymous, guestPassword, countryCode, outgoingUnivId } = body as {
      title: string;
      content: string;
      isAnonymous: boolean;
      guestPassword: string | null;
      countryCode?: string;
      outgoingUnivId?: number;
    };

    // 유효성 검증: 제목과 본문은 필수
    if (!title || title.trim() === "") {
      return HttpResponse.json({ detail: "제목은 비어 있을 수 없습니다." }, { status: 400 });
    }
    if (!content || content.trim() === "") {
      return HttpResponse.json({ detail: "내용은 비어 있을 수 없습니다." }, { status: 400 });
    }

    // 비회원 검증: guestPassword가 있으면 비회원, 없으면 회원으로 간주
    // guestPassword가 빈 문자열("")이나 공백만 있는 경우 먼저 검증
    if (guestPassword !== null && guestPassword !== undefined && guestPassword.trim() === "") {
      return HttpResponse.json({ detail: "비회원은 비밀번호를 입력해야 합니다." }, { status: 400 });
    }
    const isMember = !guestPassword;

    // Mock 게시글 생성
    const newPost = createMockPost({
      title,
      content,
      isAnonymous: isMember ? isAnonymous : false, // 비회원은 항상 익명 false
      isMember,
    });

    // 생성된 게시글을 해당 커뮤니티에 추가 (실제로는 메모리에만 존재)
    if (countryCode) {
      const upperCountryCode = countryCode.toUpperCase();
      const communityData = mockCommunityPostsByCountry[upperCountryCode];
      if (communityData) {
        communityData.posts.unshift(newPost);
        communityData.pagination.totalItems += 1;
      }
    } else if (outgoingUnivId) {
      const communityData = mockCommunityPostsByUniversity[outgoingUnivId];
      if (communityData) {
        communityData.posts.unshift(newPost);
        communityData.pagination.totalItems += 1;
      }
    }

    // 201 Created 응답
    return HttpResponse.json(newPost, { status: 201 });
  }),

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

      // NaN 체크: 숫자 변환 실패 시 400 Bad Request
      if (isNaN(univId)) {
        return HttpResponse.json({ detail: "outgoingUnivId는 숫자여야 합니다." }, { status: 400 });
      }

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
