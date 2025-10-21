/**
 * 교환학생 지원 슬롯 정보
 */
export interface Slot {
  slotId: number;
  name: string;
  country: string;
  choiceCount: number;
  slotCount: string;
  duration: string;
}

/**
 * 시즌별 슬롯 목록 조회 응답
 */
export interface SeasonSlotsResponse {
  seasonId: number;
  seasonName: string;
  slots: Slot[];
}
