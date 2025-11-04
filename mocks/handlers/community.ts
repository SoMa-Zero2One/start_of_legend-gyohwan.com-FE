import { http, HttpResponse } from "msw";
import { mockCountriesApi, mockUniversitiesApi } from "../data/community";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const communityHandlers = [
  // GET /v1/windows/countries - 나라 목록 조회
  http.get(`${BACKEND_URL}/v1/windows/countries`, () => {
    return HttpResponse.json(mockCountriesApi);
  }),

  // GET /v1/windows/universities - 대학 목록 조회
  http.get(`${BACKEND_URL}/v1/windows/universities`, () => {
    return HttpResponse.json(mockUniversitiesApi);
  }),
];
