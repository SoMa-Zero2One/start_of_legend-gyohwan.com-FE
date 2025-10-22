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

/**
 * 지원자 정보
 */
export interface Choice {
  applicationId: number;
  nickname: string;
  choice: number;
  gpaScore: number | null;
  gpaCriteria: number | null;
  languageTest: string | null;
  languageGrade: string | null;
  languageScore: string | null;
  extraScore: number | null;
  score: number | null;
  etc: string;
}

/**
 * 슬롯 상세 조회 응답
 */
export interface SlotDetailResponse {
  slotId: number;
  isApplied: boolean;
  seasonId: number;
  name: string;
  country: string;
  choiceCount: number;
  slotCount: string;
  duration: string;
  etc: string | null;
  choices: Choice[];
}
