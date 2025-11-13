import { FieldMetadata } from "@/types/community";

// 대학 필드 메타데이터 (프론트엔드에서 중앙 관리)
export const UNIVERSITY_FIELDS: Record<string, FieldMetadata> = {
  continent: {
    fieldId: 1, // 백엔드 API의 fieldId (대륙)
    key: "continent",
    label: "대륙",
    type: "string",
    sortable: false,
    defaultVisible: false, // 필터 전용 (테이블에 표시 안 함)
    displayOrder: 99, // 맨 뒤
  },
  country: {
    fieldId: 0, // 프론트 전용 (countryName을 필드로 추가)
    key: "country",
    label: "나라",
    type: "string",
    sortable: true, // 나라는 정렬 가능
    defaultVisible: true,
    displayOrder: 1, // 맨 앞
  },
  totalCost: {
    fieldId: 5, // 총액
    key: "totalCost",
    label: "총액",
    type: "string",
    sortable: false,
    defaultVisible: true,
    displayOrder: 2,
  },
  qsRanking: {
    fieldId: 6, // QS 랭킹
    key: "qsRanking",
    label: "QS 랭킹",
    type: "string",
    sortable: false,
    defaultVisible: true,
    displayOrder: 3,
  },
  englishRatio: {
    fieldId: 7, // 모국어:영어 비율 → 영어 사용 비율
    key: "englishRatio",
    label: "영어 사용 비율",
    type: "string",
    sortable: false,
    defaultVisible: true,
    displayOrder: 4,
  },
  internationalProgram: {
    fieldId: 8, // 국제처 프로그램
    key: "internationalProgram",
    label: "국제처 프로그램",
    type: "string",
    sortable: false,
    defaultVisible: true,
    displayOrder: 5,
  },
  dormitory: {
    fieldId: 9, // 기숙사 유무, 기숙사비, 거리
    key: "dormitory",
    label: "기숙사",
    type: "string",
    sortable: false,
    defaultVisible: true,
    displayOrder: 6,
  },
  accessibility: {
    fieldId: 10, // 주변 교통 접근성
    key: "accessibility",
    label: "주변 접근성",
    type: "string",
    sortable: false,
    defaultVisible: true,
    displayOrder: 7,
  },
  weather: {
    fieldId: 11, // 날씨
    key: "weather",
    label: "날씨",
    type: "string",
    sortable: false,
    defaultVisible: true,
    displayOrder: 8,
  },
  safety: {
    fieldId: 12, // 치안
    key: "safety",
    label: "치안",
    type: "string",
    sortable: false,
    defaultVisible: true,
    displayOrder: 9,
  },
};

// fieldId로 메타데이터 조회
export function getUniversityFieldMetadata(fieldId: number): FieldMetadata | undefined {
  return Object.values(UNIVERSITY_FIELDS).find((f) => f.fieldId === fieldId);
}

// key로 메타데이터 조회
export function getUniversityFieldByKey(key: string): FieldMetadata | undefined {
  return UNIVERSITY_FIELDS[key];
}

// 기본으로 표시할 필드 키 목록 (displayOrder 순서대로)
export function getDefaultVisibleUniversityFields(): string[] {
  return Object.values(UNIVERSITY_FIELDS)
    .filter((f) => f.defaultVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((f) => f.key);
}

// 모든 필드 키 목록 (displayOrder 순서대로)
export function getAllUniversityFieldKeys(): string[] {
  return Object.values(UNIVERSITY_FIELDS)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((f) => f.key);
}
