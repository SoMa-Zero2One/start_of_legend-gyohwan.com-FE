import type { UniversityDetailResponse } from "@/types/university";

/**
 * Mock 대학 데이터
 * 대학별 상세 정보
 */

/**
 * 테네시 대학 - 채터누가 캠퍼스 (univId: 1)
 */
export const mockUniversityUTC: UniversityDetailResponse = {
  univId: 1,
  name: "University of Tennessee at Chattanooga (UTC)",
  countryCode: "US",
  countryName: "미국",
  logoUrl: null,
  data: [
    {
      fieldId: 6,
      fieldName: "예산",
      value: "1,000만원 이상",
      type: "STRING",
    },
    {
      fieldId: 7,
      fieldName: "여학",
      value: "좋음",
      type: "STRING",
    },
    {
      fieldId: 8,
      fieldName: "물가",
      value: "높음",
      type: "STRING",
    },
    {
      fieldId: 9,
      fieldName: "교학생 프로그램",
      value: "프로그램 상세 내용",
      type: "STRING",
    },
  ],
};

/**
 * 도쿄대학 (univId: 2) - 일부 필드 null 테스트
 */
export const mockUniversityTokyo: UniversityDetailResponse = {
  univId: 2,
  name: "University of Tokyo",
  countryCode: "JP",
  countryName: "일본",
  logoUrl: "https://example.com/tokyo-univ-logo.png",
  data: [
    {
      fieldId: 6,
      fieldName: "물가지수",
      value: "85",
      type: "NUMBER",
    },
    {
      fieldId: 7,
      fieldName: "QS 랭킹",
      value: "23",
      type: "NUMBER",
    },
    {
      fieldId: 11,
      fieldName: "국제처 프로그램",
      value: "국제교류센터 운영",
      type: "STRING",
    },
    {
      fieldId: 12,
      fieldName: "기숙사",
      value: "캠퍼스 내 기숙사 제공",
      type: "STRING",
    },
    {
      fieldId: 13,
      fieldName: "주변 접근성",
      value: "나리타 공항 60분, 도쿄역 15분",
      type: "STRING",
    },
    {
      fieldId: 14,
      fieldName: "날씨",
      value: "사계절 뚜렷, 여름 습함",
      type: "STRING",
    },
  ],
};

/**
 * 최악의 경우 - 모든 필드 null (univId: 999)
 */
export const mockUniversityMinimal: UniversityDetailResponse = {
  univId: 999,
  name: null,
  countryCode: null,
  countryName: null,
  logoUrl: null,
  data: null,
};

/**
 * 대학 ID별 Mock 데이터 매핑
 */
export const mockUniversities: Record<number, UniversityDetailResponse> = {
  1: mockUniversityUTC,
  2: mockUniversityTokyo,
  999: mockUniversityMinimal,
};
