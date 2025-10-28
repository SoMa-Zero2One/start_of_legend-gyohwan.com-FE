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
  logoUrl: string | null;
  homepageUrl: string | null; // 대학교 홈페이지 URL
}

/**
 * 시즌별 슬롯 목록 조회 응답
 */
export interface SeasonSlotsResponse {
  seasonId: number;
  seasonName: string;
  hasApplied: boolean; // 사용자가 이미 지원했는지 여부
  applicantCount: number;
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
 * Slot 타입을 확장하여 중복 방지
 */
export interface SlotDetailResponse extends Slot {
  hasApplied: boolean;
  seasonId: number;
  etc: string | null;
  choices: Choice[];
}

/**
 * 지원서의 지망 선택 정보
 */
export interface ApplicationChoiceWithSlot {
  choice: number;
  slot: Slot;
}

/**
 * 내 지원서 조회 응답
 */
export interface MyApplicationResponse {
  applicationId: number;
  seasonId: number;
  nickname: string;
  gpa: {
    score: number;
    criteria: string;
  };
  language: {
    testType: string;
    score: string;
    grade: string | null;
  };
  choices: ApplicationChoiceWithSlot[];
}

/**
 * 지원자 상세 정보 조회 응답 (MyApplicationResponse와 동일한 구조)
 */
export type ApplicationDetailResponse = MyApplicationResponse;
