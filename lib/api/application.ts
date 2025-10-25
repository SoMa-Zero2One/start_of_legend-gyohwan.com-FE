import type { SubmitApplicationRequest, UpdateApplicationRequest } from '@/types/application';
import { getBackendUrl } from '@/lib/utils/api';

/**
 * 지원서 제출
 * @param seasonId - 시즌 ID
 * @param data - 지원서 정보 (가산점, 지망 선택 목록)
 * @throws {Error} API 호출 실패 시
 */
export const submitApplication = async (
  seasonId: number,
  data: SubmitApplicationRequest
): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/seasons/${seasonId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`지원서 제출 실패 (HTTP ${response.status})`);
  }
};

/**
 * 지원서 수정 (지망 대학 재선택)
 * @param seasonId - 시즌 ID
 * @param data - 지망 선택 목록
 * @throws {Error} API 호출 실패 시
 */
export const updateApplication = async (
  seasonId: number,
  data: UpdateApplicationRequest
): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/seasons/${seasonId}/my-application`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`지원서 수정 실패 (HTTP ${response.status})`);
  }
};
