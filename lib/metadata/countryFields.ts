import { FieldMetadata } from "@/types/community";

// 나라 필드 메타데이터 (프론트엔드에서 중앙 관리)
// continent는 필터 전용이므로 여기 포함 안 함
export const COUNTRY_FIELDS: Record<string, FieldMetadata> = {
  visaDifficulty: {
    fieldId: 1, // 백엔드 API의 fieldId (고정값)
    key: "visaDifficulty",
    label: "비자 발급 난이도",
    type: "level",
    sortable: true,
    defaultVisible: true,
    displayOrder: 1, // 화면 표시 순서 (변경 가능)
    renderConfig: { levelMax: 5 },
  },
  language: {
    fieldId: 2,
    key: "language",
    label: "사용 언어",
    type: "string",
    sortable: false,
    defaultVisible: true,
    displayOrder: 4,
    renderConfig: { badge: true }, // 배지 스타일로 렌더링
  },
  safety: {
    fieldId: 3,
    key: "safety",
    label: "치안",
    type: "level",
    sortable: true,
    defaultVisible: true,
    displayOrder: 2,
    renderConfig: { levelMax: 5 },
  },
  englishLevel: {
    fieldId: 4,
    key: "englishLevel",
    label: "영어 사용지수",
    type: "number",
    sortable: true,
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
