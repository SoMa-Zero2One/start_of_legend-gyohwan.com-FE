import type { AuthSuccessResponse, EmailCheckResponse } from '@/types/auth';
import { getBackendUrl } from '@/lib/utils/api';

/**
 * 이메일 존재 여부 확인 (회원가입 vs 로그인 분기용)
 * @param email - 확인할 이메일 주소
 * @returns 이메일 존재 여부
 * @throws {Error} API 호출 실패 시
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(
    `${backendUrl}/v1/auth/signup/email/check?email=${encodeURIComponent(email)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`이메일 확인 실패 (HTTP ${response.status})`);
  }

  const data: EmailCheckResponse = await response.json();
  return data.exists;
};

/**
 * Google 소셜 로그인
 * @param code - OAuth 인증 코드
 * @returns 액세스 토큰 및 리프레시 토큰
 * @throws {Error} 로그인 실패 시
 */
export const loginWithGoogle = async (code: string): Promise<AuthSuccessResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(
    `${backendUrl}/v1/auth/login/social/google`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 설정을 위해 필요
      body: JSON.stringify({ code }),
    }
  );

  if (!response.ok) {
    throw new Error(`Google 로그인 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};

/**
 * Kakao 소셜 로그인
 * @param code - OAuth 인증 코드
 * @returns 액세스 토큰 및 리프레시 토큰
 * @throws {Error} 로그인 실패 시
 */
export const loginWithKakao = async (code: string): Promise<AuthSuccessResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(
    `${backendUrl}/v1/auth/login/social/kakao`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 설정을 위해 필요
      body: JSON.stringify({ code }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Kakao 로그인 실패 (HTTP ${response.status})${errorText ? `: ${errorText}` : ''}`
    );
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

  const response = await fetch(
    `${backendUrl}/v1/auth/signup/email`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `회원가입 실패 (HTTP ${response.status})${errorText ? `: ${errorText}` : ''}`
    );
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

  const response = await fetch(
    `${backendUrl}/v1/auth/signup/email/confirm`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 설정을 위해 필요
      body: JSON.stringify({ email, code }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `이메일 인증 실패 (HTTP ${response.status})${errorText ? `: ${errorText}` : ''}`
    );
  }
};

/**
 * 이메일 로그인
 * @param email - 이메일 주소
 * @param password - 비밀번호
 * @returns 액세스 토큰 및 리프레시 토큰
 * @throws {Error} 로그인 실패 시
 */
export const loginWithEmail = async (email: string, password: string): Promise<AuthSuccessResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(
    `${backendUrl}/v1/auth/login/email`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 설정을 위해 필요
      body: JSON.stringify({ email, password }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `이메일 로그인 실패 (HTTP ${response.status})${errorText ? `: ${errorText}` : ''}`
    );
  }

  return await response.json();
};
