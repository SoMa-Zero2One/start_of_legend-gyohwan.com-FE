/**
 * 대학 정보 타입
 * ID 필드를 제외한 모든 필드는 null일 수 있음 (방어적 코딩)
 */

/**
 * 필드 타입
 */
export type FieldType = "LEVEL" | "STRING" | "NUMBER";

/**
 * 대학 필드 정보
 */
export interface UniversityField {
  fieldId: number; // ✅ ID는 필수
  fieldName: string | null;
  value: string | number | null;
  type: FieldType | null;
}

/**
 * 대학 상세 정보 응답
 */
export interface UniversityDetailResponse {
  univId: number; // ✅ ID는 필수
  name: string | null;
  countryCode: string | null;
  countryName: string | null;
  logoUrl: string | null;
  data: UniversityField[] | null;
}
