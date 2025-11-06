import { http, HttpResponse } from "msw";
import { mockCountries } from "../data/countries";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

/**
 * ProblemDetail 에러 응답 생성 헬퍼
 */
function createErrorResponse(status: number, detail: string, title?: string) {
  return HttpResponse.json(
    {
      type: "about:blank",
      title: title || getStatusText(status),
      status,
      detail,
    },
    { status }
  );
}

function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    500: "Internal Server Error",
  };
  return statusTexts[status] || "Error";
}

/**
 * Country Handlers
 */
export const countryHandlers = [
  /**
   * GET /v1/windows/countries/:countryCode
   * 국가 상세 정보 조회 (대학 목록 포함)
   *
   * 에러 테스트:
   * - 존재하지 않는 국가 코드 → 404 Not Found
   */
  http.get(`${BACKEND_URL}/v1/windows/countries/:countryCode`, ({ params }) => {
    const { countryCode } = params;

    // 국가 코드가 문자열인지 확인
    if (typeof countryCode !== "string") {
      return createErrorResponse(400, "유효하지 않은 국가 코드입니다.");
    }

    // 대문자로 변환 (US, JP 등)
    const upperCountryCode = countryCode.toUpperCase();

    // Mock 데이터에서 국가 찾기
    const country = mockCountries[upperCountryCode];

    if (!country) {
      return createErrorResponse(404, "국가를 찾을 수 없습니다.");
    }

    return HttpResponse.json(country);
  }),
];
