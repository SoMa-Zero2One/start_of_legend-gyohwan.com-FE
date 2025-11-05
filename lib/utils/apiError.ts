import type { ApiErrorResponse, AuthErrorType } from "@/types/apiError";
import { AUTH_ERROR_MESSAGES, DEFAULT_ERROR_MESSAGES } from "@/types/apiError";

/**
 * AuthErrorType 타입 가드 함수
 *
 * USAGE: errorData.type이 AuthErrorType인지 타입 안전하게 확인
 * WHY: 'in' 연산자는 타입 가드로 작동하지 않아 'as' 캐스팅 필요했음
 * ALTERNATIVES: as 타입 캐스팅 (rejected: 타입 안전성 우회)
 */
function isAuthErrorType(type: string): type is AuthErrorType {
  return type in AUTH_ERROR_MESSAGES;
}

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
    if (errorData.type && isAuthErrorType(errorData.type)) {
      return AUTH_ERROR_MESSAGES[errorData.type];
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

/**
 * API 호출 중 발생한 에러를 처리하여 사용자 친화적인 메시지 반환
 *
 * USAGE: try-catch 블록에서 모든 에러 타입 처리
 * - 네트워크 에러 (TypeError)
 * - API 에러 (Error with message)
 * - 기타 에러
 *
 * WHY:
 * - 네트워크 끊김, 타임아웃 등 다양한 에러 상황 대응
 * - 일관된 에러 메시지 제공
 * - 컴포넌트에서 단순하게 사용 가능
 *
 * ALTERNATIVES:
 * - 각 컴포넌트에서 개별 처리 (rejected: 코드 중복)
 * - API 함수에서 처리 (rejected: API 함수 복잡도 증가)
 *
 * @param error - catch된 에러 객체 (unknown 타입)
 * @returns 사용자에게 보여줄 에러 메시지 (한글)
 *
 * @example
 * ```typescript
 * try {
 *   await loginWithEmail(email, password);
 * } catch (error) {
 *   const errorMessage = handleApiError(error);
 *   setError(errorMessage);
 *   // TypeError → "네트워크 연결을 확인해주세요."
 *   // Error → error.message
 * }
 * ```
 */
export const handleApiError = (error: unknown): string => {
  // 1. TypeError = fetch 자체 실패 (네트워크 에러, CORS 에러 등)
  if (error instanceof TypeError) {
    return "네트워크 연결을 확인해주세요.";
  }

  // 2. Error 객체 = API에서 throw한 에러 (parseApiError 처리된 메시지)
  if (error instanceof Error) {
    return error.message;
  }

  // 3. 문자열로 throw된 경우
  if (typeof error === "string") {
    return error;
  }

  // 4. 알 수 없는 에러 타입
  return "알 수 없는 오류가 발생했습니다.";
};
