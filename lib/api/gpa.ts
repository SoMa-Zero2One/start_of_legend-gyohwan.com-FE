import type { GpasResponse, CreateGpaRequest, CreateGpaResponse } from '@/types/grade';
import { getBackendUrl } from '@/lib/utils/api';

/**
 * 사용자 학점 정보 조회
 * @returns 학점 목록
 * @throws {Error} API 호출 실패 시
 */
export const getGpas = async (): Promise<GpasResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/users/me/gpas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
  });

  if (!response.ok) {
    throw new Error(`학점 정보 조회 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};

/**
 * 학점 정보 생성/수정
 * @param data - 학점 정보
 * @returns 생성된 학점 정보
 * @throws {Error} API 호출 실패 시
 */
export const createGpa = async (data: CreateGpaRequest): Promise<CreateGpaResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/users/me/gpas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`학점 정보 생성 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};
