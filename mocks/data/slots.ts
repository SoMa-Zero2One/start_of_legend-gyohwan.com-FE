import type { Slot } from '@/types/slot';

/**
 * Mock 슬롯 (교환 대학) 데이터
 */

export const mockSlots: Slot[] = [
  {
    slotId: 1,
    name: 'UC Berkeley',
    country: '미국',
    logoUrl: 'https://example.com/berkeley.png',
    choiceCount: 15,
    slotCount: '2',
    duration: '1학기',
  },
  {
    slotId: 2,
    name: 'UCLA',
    country: '미국',
    logoUrl: 'https://example.com/ucla.png',
    choiceCount: 23,
    slotCount: '3',
    duration: '1학기',
  },
  {
    slotId: 3,
    name: 'University of Tokyo',
    country: '일본',
    logoUrl: 'https://example.com/tokyo.png',
    choiceCount: 18,
    slotCount: '2',
    duration: '1학기',
  },
  {
    slotId: 4,
    name: 'Oxford University',
    country: '영국',
    logoUrl: 'https://example.com/oxford.png',
    choiceCount: 30,
    slotCount: '1',
    duration: '1년',
  },
  {
    slotId: 5,
    name: 'National University of Singapore',
    country: '싱가포르',
    logoUrl: 'https://example.com/nus.png',
    choiceCount: 12,
    slotCount: '4',
    duration: '1학기',
  },
  {
    slotId: 6,
    name: 'ETH Zurich',
    country: '스위스',
    logoUrl: 'https://example.com/eth.png',
    choiceCount: 8,
    slotCount: '2',
    duration: '미정',
  },
];

/**
 * 슬롯 ID로 슬롯 찾기
 */
export function findSlotById(slotId: number): Slot | undefined {
  return mockSlots.find((s) => s.slotId === slotId);
}

/**
 * 시즌별 슬롯 매핑
 */
export const mockSeasonSlots: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5], // 시즌 1에 속한 슬롯 ID들
  2: [1, 3, 5, 6], // 시즌 2에 속한 슬롯 ID들
  3: [2, 4, 6], // 시즌 3에 속한 슬롯 ID들
  4: [1, 2, 3], // 시즌 4에 속한 슬롯 ID들
};

/**
 * 슬롯별 지원자 목록 (간단한 mock)
 */
export interface MockApplicant {
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

export const mockSlotApplicants: Record<number, MockApplicant[]> = {
  1: [
    {
      applicationId: 1,
      nickname: '열정적인펭귄',
      choice: 1,
      gpaScore: 4.21,
      gpaCriteria: 4.5,
      languageTest: 'TOEIC',
      languageGrade: 'A',
      languageScore: '900',
      extraScore: 1.5,
      score: 85.5,
      etc: '',
    },
    {
      applicationId: 2,
      nickname: '성실한사자',
      choice: 2,
      gpaScore: 4.0,
      gpaCriteria: 4.3,
      languageTest: 'TOEFL_IBT',
      languageGrade: null,
      languageScore: '105',
      extraScore: 0,
      score: 82.3,
      etc: '',
    },
    {
      applicationId: 3,
      nickname: '똑똑한여우',
      choice: 1,
      gpaScore: 4.5,
      gpaCriteria: 4.5,
      languageTest: 'IELTS',
      languageGrade: null,
      languageScore: '8.0',
      extraScore: 2.0,
      score: 90.0,
      etc: '',
    },
  ],
  2: [
    {
      applicationId: 4,
      nickname: '용감한독수리',
      choice: 1,
      gpaScore: 3.9,
      gpaCriteria: 4.5,
      languageTest: 'TOEIC',
      languageGrade: 'B',
      languageScore: '850',
      extraScore: 1.0,
      score: 80.0,
      etc: '',
    },
  ],
  3: [
    {
      applicationId: 5,
      nickname: '부지런한토끼',
      choice: 1,
      gpaScore: 4.1,
      gpaCriteria: 4.3,
      languageTest: 'JLPT',
      languageGrade: 'N1',
      languageScore: null,
      extraScore: 0.5,
      score: 83.0,
      etc: '',
    },
  ],
  4: [],
  5: [],
  6: [],
};

/**
 * 지원자가 지원하지 않은 슬롯에서는 민감 정보가 null로 표시됨
 */
export const mockSlotApplicantsRestricted: Record<number, MockApplicant[]> = {
  1: [
    {
      applicationId: 1,
      nickname: '열정적인펭귄',
      choice: 1,
      gpaScore: null,
      gpaCriteria: null,
      languageTest: null,
      languageGrade: null,
      languageScore: null,
      extraScore: null,
      score: null,
      etc: '',
    },
    {
      applicationId: 2,
      nickname: '성실한사자',
      choice: 2,
      gpaScore: null,
      gpaCriteria: null,
      languageTest: null,
      languageGrade: null,
      languageScore: null,
      extraScore: null,
      score: null,
      etc: '',
    },
  ],
};
