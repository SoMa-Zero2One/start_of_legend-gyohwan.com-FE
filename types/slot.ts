/**
 * 교환학생 지원 슬롯 정보
 * ID를 제외한 모든 필드는 null일 수 있음 (방어적 코딩)
 */
export interface Slot {
  slotId: number;
  name: string | null;
  country: string | null;
  choiceCount: number | null;
  slotCount: string | null;
  duration: string | null;
  logoUrl: string | null;
  homepageUrl: string | null; // 대학교 홈페이지 URL
  universityId: number | null; // 커뮤니티 대학 ID (null이면 커뮤니티 대학 탭으로 이동)
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
    testType: string | null;
    score: string;
    grade: string | null;
  };
  choices: ApplicationChoiceWithSlot[];
}

/**
 * 지원자 상세 정보 조회 응답 (MyApplicationResponse와 동일한 구조)
 */
export type ApplicationDetailResponse = MyApplicationResponse;
