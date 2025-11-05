import type { ApiErrorResponse, AuthErrorType } from "@/types/apiError";
import { AUTH_ERROR_MESSAGES, DEFAULT_ERROR_MESSAGES } from "@/types/apiError";

/**
 * API 에러 응답을 파싱하여 사용자 친화적인 메시지 반환
 *
 * USAGE: 모든 API fetch 호출의 에러 처리에 사용
 * - Auth API (loginWithEmail, signupWithEmail 등)
 * - User API
 * - Season API 등
 *
 * WHY:
 * - 서버의 RFC 7807 형식 에러를 사용자 친화적 메시지로 변환
 * - 일관된 에러 처리 (DRY 원칙)
 * - 에러 메시지 중앙 관리
 *
 * ALTERNATIVES:
 * - 각 API 함수마다 개별 처리 (rejected: 코드 중복)
 * - response.text()만 사용 (rejected: 구조화된 에러 정보 활용 못함)
 *
 * @param response - fetch API의 Response 객체
 * @returns 사용자에게 보여줄 에러 메시지 (한글)
 *
 * @example
 * ```typescript
 * const response = await fetch('/v1/auth/login/email', {...});
 * if (!response.ok) {
 *   const errorMessage = await parseApiError(response);
 *   // → "이메일 로그인에 실패하였습니다. 이메일 또는 비밀번호를 확인해주세요."
 *   throw new Error(errorMessage);
 * }
 * ```
 */
export const parseApiError = async (response: Response): Promise<string> => {
  const status = response.status;

  try {
    // 1. 서버에서 JSON 에러 응답 파싱 시도
    const errorData: ApiErrorResponse = await response.json();

    // 2. detail 필드가 있으면 그대로 사용 (서버가 보낸 한글 메시지)
    if (errorData.detail) {
      return errorData.detail;
    }

    // 3. detail이 없지만 type이 Auth 에러면 우리가 정의한 메시지 사용
    if (errorData.type && errorData.type in AUTH_ERROR_MESSAGES) {
      return AUTH_ERROR_MESSAGES[errorData.type as AuthErrorType];
    }

    // 4. type도 모르면 HTTP 상태 코드로 기본 메시지
    if (status in DEFAULT_ERROR_MESSAGES) {
      return DEFAULT_ERROR_MESSAGES[status];
    }

    // 5. 최악의 경우 일반 메시지
    return `오류가 발생했습니다 (HTTP ${status})`;
  } catch {
    // JSON 파싱 실패 (서버가 JSON 안 보낸 경우)
    // → HTTP 상태 코드로 기본 메시지 반환
    if (status in DEFAULT_ERROR_MESSAGES) {
      return DEFAULT_ERROR_MESSAGES[status];
    }

    return `서버 오류가 발생했습니다 (HTTP ${status})`;
  }
};
