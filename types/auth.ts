export type OAuthProvider = "kakao" | "google";

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  authorizationEndpoint: string;
}

// OAuth URL 콜백 파라미터
export interface OAuthCallbackParams {
  code: string;
  state: string;
  error?: string;
}

// 백엔드 API 성공 응답
export interface AuthSuccessResponse {
  accessToken: string;
}

// 백엔드 API 실패 응답 (RFC 7807 Problem Details)
export interface AuthErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}

// 이메일 존재 여부 확인 응답
export interface EmailCheckResponse {
  exists: boolean;
}
