import type { User } from "@/types/user";
import { getBackendUrl } from "@/lib/utils/api";
import { parseApiError } from "@/lib/utils/apiError";

/**
 * 현재 로그인한 사용자 정보 조회
 * @returns 사용자 정보 (로그아웃 상태면 null)
 * @throws {Error} API 호출 실패 시
 */
export const getUserMe = async (): Promise<User | null> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/users/me`, {
    method: "GET",
    credentials: "include", // 쿠키 포함
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함
    body: JSON.stringify({ schoolEmail }),
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함
    body: JSON.stringify({ schoolEmail, code }),
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }
};

/**
 * 회원 탈퇴
 * @throws {Error} API 호출 실패 시
 */
export const withdrawAccount = async (): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/users/me/withdraw`, {
    method: "DELETE",
    credentials: "include", // 쿠키 포함
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }
};

/**
 * 비밀번호 변경
 * @param currentPassword - 현재 비밀번호
 * @param newPassword - 새 비밀번호
 * @throws {Error} API 호출 실패 시
 */
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/users/me/password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }
};
