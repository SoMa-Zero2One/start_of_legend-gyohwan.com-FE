import { http, HttpResponse } from "msw";
import { mockUniversities } from "../data/universities";

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
 * University Handlers
 */
export const universityHandlers = [
  /**
   * GET /v1/windows/outgoing-universities/:univId
   * 대학 상세 정보 조회
   *
   * 에러 테스트:
   * - 존재하지 않는 대학 ID → 404 Not Found
   * - 잘못된 ID 형식 → 400 Bad Request
   */
  http.get(`${BACKEND_URL}/v1/windows/outgoing-universities/:univId`, ({ params }) => {
    const { univId } = params;

    // univId가 문자열인지 확인
    if (typeof univId !== "string") {
      return createErrorResponse(400, "유효하지 않은 대학 ID입니다.");
    }

    // 숫자로 변환
    const univIdNum = parseInt(univId, 10);

    // 숫자 변환 실패
    if (isNaN(univIdNum)) {
      return createErrorResponse(400, "대학 ID는 숫자여야 합니다.");
    }

    // Mock 데이터에서 대학 찾기
    const university = mockUniversities[univIdNum];

    if (!university) {
      return createErrorResponse(404, "대학을 찾을 수 없습니다.");
    }

    return HttpResponse.json(university);
  }),
];
