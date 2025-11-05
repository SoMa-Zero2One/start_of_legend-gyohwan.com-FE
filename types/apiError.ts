/**
 * API 에러 응답 타입
 * RFC 7807 Problem Details 형식을 따름
 *
 * USAGE: 모든 API 에러 응답 파싱에 사용
 * - Auth API 에러
 * - User API 에러
 * - Season API 에러 등
 */

/**
 * 백엔드 API 에러 응답 (RFC 7807 Problem Details)
 *
 * @example
 * {
 *   "type": "EMAIL_LOGIN_FAILED",
 *   "title": "Unauthorized",
 *   "status": 401,
 *   "detail": "이메일 로그인에 실패하였습니다. 이메일 또는 비밀번호를 확인해주세요.",
 *   "instance": "/v1/auth/login/email"
 * }
 */
export interface ApiErrorResponse {
  /** 에러 타입 (예: EMAIL_LOGIN_FAILED, EMAIL_ALREADY_EXISTS) */
  type: string;
  /** HTTP 상태 메시지 (예: Unauthorized, Bad Request) */
  title: string;
  /** HTTP 상태 코드 (예: 401, 400, 409) */
  status: number;
  /** 사용자 친화적인 에러 메시지 (한글) */
  detail: string;
  /** 에러가 발생한 API 경로 */
  instance: string;
}

/**
 * Auth API 에러 타입들 (ErrorCode 기반)
 *
 * USAGE: Auth API에서 발생 가능한 에러 타입 체크
 */
export type AuthErrorType =
  // Kakao OAuth
  | "KAKAO_REDIRECT_URI_MISMATCH"
  | "INVALID_OR_EXPIRED_KAKAO_AUTH_CODE"
  // Google OAuth
  | "INVALID_OR_EXPIRED_GOOGLE_AUTH_CODE"
  // Email Login
  | "EMAIL_LOGIN_FAILED"
  // Email Signup
  | "EMAIL_ALREADY_EXISTS"
  | "PASSWORD_TOO_SHORT"
  // Email Confirm
  | "EMAIL_CONFIRM_REQUEST_NOT_FOUND"
  | "EMAIL_CONFIRM_CODE_DIFFERENT";

/**
 * 에러 타입별 사용자 친화적 메시지 매핑
 *
 * USAGE: 서버에서 detail이 없거나 영문일 때 한글 메시지로 대체
 * WHY: 일관된 사용자 경험 제공
 */
export const AUTH_ERROR_MESSAGES: Record<AuthErrorType, string> = {
  // Kakao OAuth
  KAKAO_REDIRECT_URI_MISMATCH: "리다이렉트 URI가 잘못되었습니다.",
  INVALID_OR_EXPIRED_KAKAO_AUTH_CODE:
    "사용할 수 없는 카카오 인증 코드입니다. 카카오 인증 코드는 일회용이며, 인증 만료 시간은 10분입니다.",

  // Google OAuth
  INVALID_OR_EXPIRED_GOOGLE_AUTH_CODE: "사용할 수 없는 구글 인증 코드입니다.",

  // Email Login
  EMAIL_LOGIN_FAILED: "이메일 로그인에 실패하였습니다. 이메일 또는 비밀번호를 확인해주세요.",

  // Email Signup
  EMAIL_ALREADY_EXISTS: "이미 사용 중인 이메일입니다.",
  PASSWORD_TOO_SHORT: "비밀번호는 최소 12자 이상이어야 합니다.",

  // Email Confirm
  EMAIL_CONFIRM_REQUEST_NOT_FOUND: "인증 시간이 만료되었거나 요청된 적 없는 이메일입니다.",
  EMAIL_CONFIRM_CODE_DIFFERENT: "인증 코드가 일치하지 않습니다.",
};

/**
 * HTTP 상태 코드별 기본 에러 메시지
 *
 * USAGE: 서버에서 에러 정보가 없을 때 폴백 메시지
 */
export const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: "잘못된 요청입니다. 입력값을 확인해주세요.",
  401: "인증에 실패했습니다. 다시 로그인해주세요.",
  403: "접근 권한이 없습니다.",
  404: "요청하신 정보를 찾을 수 없습니다.",
  409: "이미 존재하는 정보입니다.",
  500: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  502: "서버 연결에 실패했습니다.",
  503: "서비스를 일시적으로 사용할 수 없습니다.",
};
