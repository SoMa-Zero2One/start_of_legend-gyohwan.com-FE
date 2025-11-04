import { http, HttpResponse } from "msw";
import { mockCountriesApi } from "../data/community";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const communityHandlers = [
  // GET /v1/windows/countries - 나라 목록 조회
  http.get(`${BACKEND_URL}/v1/windows/countries`, () => {
    return HttpResponse.json(mockCountriesApi);
  }),
];
