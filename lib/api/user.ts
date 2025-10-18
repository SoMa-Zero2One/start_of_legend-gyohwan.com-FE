import type { User } from '@/types/user';

/**
 * 백엔드 API Base URL 가져오기
 * @throws {Error} 환경변수가 설정되지 않은 경우
 */
const getBackendUrl = (): string => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.');
  }
  return backendUrl;
};

/**
 * 현재 로그인한 사용자 정보 조회
 * @returns 사용자 정보
 * @throws {Error} API 호출 실패 시
 */
export const getUserMe = async (): Promise<User> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
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
