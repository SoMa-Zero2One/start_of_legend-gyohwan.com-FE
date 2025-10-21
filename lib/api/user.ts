import type { User } from '@/types/user';
import { getBackendUrl } from '@/lib/utils/api';

/**
 * 현재 로그인한 사용자 정보 조회
 * @returns 사용자 정보
 * @throws {Error} API 호출 실패 시
 */
export const getUserMe = async (): Promise<User> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/users/me`, {
    method: 'GET',
    credentials: 'include', // 쿠키 포함
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `사용자 정보 조회 실패 (HTTP ${response.status})${errorText ? `: ${errorText}` : ''}`
    );
  }

  return await response.json();
};

/**
 * 학교 이메일 인증 코드 발송
 * @param schoolEmail - 학교 이메일 주소
 * @throws {Error} API 호출 실패 시
 */
export const sendSchoolEmailVerification = async (schoolEmail: string): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/users/me/school-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
    body: JSON.stringify({ schoolEmail }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `학교 이메일 인증 코드 발송 실패 (HTTP ${response.status})${errorText ? `: ${errorText}` : ''}`
    );
  }
};

/**
 * 학교 이메일 인증 코드 확인
 * @param schoolEmail - 학교 이메일 주소
 * @param code - 인증 코드
 * @throws {Error} API 호출 실패 시
 */
export const confirmSchoolEmailVerification = async (schoolEmail: string, code: string): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/users/me/school-email/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
    body: JSON.stringify({ schoolEmail, code }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `학교 이메일 인증 실패 (HTTP ${response.status})${errorText ? `: ${errorText}` : ''}`
    );
  }
};
