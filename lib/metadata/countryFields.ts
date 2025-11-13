import { FieldMetadata } from "@/types/community";

// 나라 필드 메타데이터 (프론트엔드에서 중앙 관리)
export const COUNTRY_FIELDS: Record<string, FieldMetadata> = {
  continent: {
    fieldId: 1, // 백엔드 API의 fieldId (대륙)
    key: "continent",
    label: "대륙",
    type: "string",
    sortable: false,
    defaultVisible: false, // 필터 전용 (테이블에 표시 안 함)
    displayOrder: 99, // 맨 뒤
  },
  visaNote: {
    fieldId: 2, // 비자 발급 특이사항
    key: "visaNote",
    label: "비자 발급 특이사항",
    type: "string",
    sortable: false,
    defaultVisible: true,
    displayOrder: 1,
  },
  language: {
    fieldId: 3, // 사용 언어 (모국어)
    key: "language",
    label: "사용 언어",
    type: "string",
    sortable: false,
    defaultVisible: true,
    displayOrder: 2,
    renderConfig: { badge: true }, // 배지 스타일로 렌더링
  },
  englishRatio: {
    fieldId: 4, // 모국어:영어 비율 → 영어 사용 비율
    key: "englishRatio",
    label: "영어 사용 비율",
    type: "string",
    sortable: false,
    defaultVisible: true,
    displayOrder: 3,
  },
};

// fieldId로 메타데이터 조회
export function getFieldMetadata(fieldId: number): FieldMetadata | undefined {
  return Object.values(COUNTRY_FIELDS).find((f) => f.fieldId === fieldId);
}

// key로 메타데이터 조회
export function getFieldByKey(key: string): FieldMetadata | undefined {
  return COUNTRY_FIELDS[key];
}

// 기본으로 표시할 필드 키 목록 (displayOrder 순서대로)
export function getDefaultVisibleFields(): string[] {
  return Object.values(COUNTRY_FIELDS)
    .filter((f) => f.defaultVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((f) => f.key);
}

// 모든 필드 키 목록 (displayOrder 순서대로)
export function getAllFieldKeys(): string[] {
  return Object.values(COUNTRY_FIELDS)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((f) => f.key);
}
