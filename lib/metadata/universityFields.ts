import { FieldMetadata } from "@/types/community";

// 대학 필드 메타데이터 (프론트엔드에서 중앙 관리)
export const UNIVERSITY_FIELDS: Record<string, FieldMetadata> = {
  country: {
    fieldId: 0, // 프론트 전용 (countryName을 필드로 추가)
    key: "country",
    label: "나라",
    type: "string",
    sortable: true, // 나라는 정렬 가능
    defaultVisible: true,
    displayOrder: 1, // 맨 앞
  },
  priceIndex: {
    fieldId: 6,
    key: "priceIndex",
    label: "물가지수",
    type: "number",
    sortable: true,
    defaultVisible: true,
    displayOrder: 2,
  },
  qsRanking: {
    fieldId: 7,
    key: "qsRanking",
    label: "QS 랭킹",
    type: "number",
    sortable: true,
    defaultVisible: true,
    displayOrder: 3,
  },
  englishLevel: {
    fieldId: 8,
    key: "englishLevel",
    label: "영어 사용지수",
    type: "number",
    sortable: true,
    defaultVisible: true,
    displayOrder: 4,
  },
  internationalProgram: {
    fieldId: 9,
    key: "internationalProgram",
    label: "국제처 프로그램",
    type: "string",
    sortable: false, // STRING은 정렬 불가
    defaultVisible: true,
    displayOrder: 5,
  },
  dormitory: {
    fieldId: 10,
    key: "dormitory",
    label: "기숙사",
    type: "string",
    sortable: false, // STRING은 정렬 불가
    defaultVisible: true,
    displayOrder: 6,
  },
  accessibility: {
    fieldId: 11,
    key: "accessibility",
    label: "주변 접근성",
    type: "string",
    sortable: false, // STRING은 정렬 불가
    defaultVisible: true,
    displayOrder: 7,
  },
  weather: {
    fieldId: 12,
    key: "weather",
    label: "날씨",
    type: "string",
    sortable: false, // STRING은 정렬 불가
    defaultVisible: true,
    displayOrder: 8,
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
