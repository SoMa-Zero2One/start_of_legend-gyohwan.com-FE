import type { SeasonsResponse } from '@/types/season';
import { getBackendUrl } from '@/lib/utils/api';

/**
 * 교환학생 모집 시즌 목록 조회
 * @returns 시즌 목록
 * @throws {Error} API 호출 실패 시
 */
export const getSeasons = async (): Promise<SeasonsResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/seasons`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
  });

  if (!response.ok) {
    throw new Error(`시즌 목록 조회 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};
