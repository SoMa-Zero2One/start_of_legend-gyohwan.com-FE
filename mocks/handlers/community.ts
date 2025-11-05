import { http, HttpResponse } from "msw";
import { mockCountriesApi, mockUniversitiesApi } from "../data/community";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const communityHandlers = [
  // GET /v1/windows/countries - 나라 목록 조회
  http.get(`${BACKEND_URL}/v1/windows/countries`, () => {
    return HttpResponse.json(mockCountriesApi);
  }),

  // GET /v1/windows/outgoing-universities - 대학 목록 조회
  http.get(`${BACKEND_URL}/v1/windows/outgoing-universities`, () => {
    return HttpResponse.json(mockUniversitiesApi);
  }),

  // POST /v1/windows/outgoing-universities/:univId/favorite - 즐겨찾기 추가
  http.post(`${BACKEND_URL}/v1/windows/outgoing-universities/:univId/favorite`, async ({ params }) => {
    const { univId } = params;
    const university = mockUniversitiesApi.find((univ) => univ.univId === Number(univId));

    if (!university) {
      return HttpResponse.json({ message: "대학을 찾을 수 없습니다" }, { status: 404 });
    }

    // Mock: isFavorite를 true로 변경
    university.isFavorite = true;
    console.log(`[MSW] 즐겨찾기 추가: ${university.name} (univId: ${univId})`);

    return HttpResponse.json({ message: "즐겨찾기에 추가되었습니다" }, { status: 200 });
  }),

  // DELETE /v1/windows/outgoing-universities/:univId/favorite - 즐겨찾기 삭제
  http.delete(`${BACKEND_URL}/v1/windows/outgoing-universities/:univId/favorite`, async ({ params }) => {
    const { univId } = params;
    const university = mockUniversitiesApi.find((univ) => univ.univId === Number(univId));

    if (!university) {
      return HttpResponse.json({ message: "대학을 찾을 수 없습니다" }, { status: 404 });
    }

    // Mock: isFavorite를 false로 변경
    university.isFavorite = false;
    console.log(`[MSW] 즐겨찾기 삭제: ${university.name} (univId: ${univId})`);

    return HttpResponse.json({ message: "즐겨찾기에서 삭제되었습니다" }, { status: 200 });
  }),
];
