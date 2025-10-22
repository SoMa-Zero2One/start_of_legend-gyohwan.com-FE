import type { SeasonSlotsResponse, SlotDetailResponse } from '@/types/slot';
import { getBackendUrl } from '@/lib/utils/api';

/**
 * 시즌별 교환학생 지원 슬롯 목록 조회
 * @param seasonId - 시즌 ID
 * @returns 슬롯 목록
 * @throws {Error} API 호출 실패 시
 */
export const getSeasonSlots = async (seasonId: number): Promise<SeasonSlotsResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/seasons/${seasonId}/slots`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
  });

  if (!response.ok) {
    throw new Error(`슬롯 목록 조회 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};

/**
 * 슬롯 상세 정보 조회
 * @param slotId - 슬롯 ID
 * @returns 슬롯 상세 정보 및 지원자 목록
 * @throws {Error} API 호출 실패 시
 */
export const getSlotDetail = async (slotId: number): Promise<SlotDetailResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/slots/${slotId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
  });

  if (!response.ok) {
    throw new Error(`슬롯 상세 조회 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};
