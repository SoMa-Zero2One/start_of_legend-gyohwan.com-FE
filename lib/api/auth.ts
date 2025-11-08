import type { AuthSuccessResponse, EmailCheckResponse } from "@/types/auth";
import { getBackendUrl } from "@/lib/utils/api";
import { parseApiError } from "@/lib/utils/apiError";

/**
 * 이메일 존재 여부 확인 (회원가입 vs 로그인 분기용)
 * @param email - 확인할 이메일 주소
 * @returns 이메일 존재 여부
 * @throws {Error} API 호출 실패 시
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/auth/signup/email/check?email=${encodeURIComponent(email)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  const data: EmailCheckResponse = await response.json();
  return data.exists;
};

/**
 * Google 소셜 로그인
 * @param code - OAuth 인증 코드
 * @returns 액세스 토큰
 * @throws {Error} 로그인 실패 시
 */
export const loginWithGoogle = async (code: string): Promise<AuthSuccessResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/auth/login/social/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * Kakao 소셜 로그인
 * @param code - OAuth 인증 코드
 * @returns 액세스 토큰
 * @throws {Error} 로그인 실패 시
 */
export const loginWithKakao = async (code: string): Promise<AuthSuccessResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/auth/login/social/kakao`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * 이메일 회원가입 (이메일 인증 발송)
 * @param email - 이메일 주소
 * @param password - 비밀번호
 * @throws {Error} 회원가입 실패 시
 */
export const signupWithEmail = async (email: string, password: string): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/auth/signup/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }
};

/**
 * 이메일 인증 코드 확인
 * @param email - 이메일 주소
 * @param code - 인증 코드
 * @throws {Error} 인증 실패 시
 */
export const confirmEmailSignup = async (email: string, code: string): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/auth/signup/email/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 설정을 위해 필요
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }
};

/**
 * 이메일 로그인
 * @param email - 이메일 주소
 * @param password - 비밀번호
 * @returns 액세스 토큰
 * @throws {Error} 로그인 실패 시
 */
export const loginWithEmail = async (email: string, password: string): Promise<AuthSuccessResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/auth/login/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 설정을 위해 필요
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * 로그아웃
 * @throws {Error} 로그아웃 실패 시
 */
export const logout = async (): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 전송을 위해 필요
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }
};

/**
 * 비밀번호 재설정 요청 (이메일로 인증번호 발송)
 * @param email - 이메일 주소
 * @throws {Error} 요청 실패 시
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/auth/password-reset/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }
};

/**
 * 비밀번호 재설정 확인 (인증번호 + 새 비밀번호)
 * @param email - 이메일 주소
 * @param code - 인증번호 (6자리)
 * @param newPassword - 새 비밀번호
 * @throws {Error} 재설정 실패 시
 */
export const confirmPasswordReset = async (email: string, code: string, newPassword: string): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/auth/password-reset/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code, newPassword }),
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }
};
