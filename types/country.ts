/**
 * 국가 정보 타입
 * ID 필드를 제외한 모든 필드는 null일 수 있음 (방어적 코딩)
 */

/**
 * 필드 타입
 */
export type FieldType = "LEVEL" | "STRING" | "NUMBER";

/**
 * 국가 필드 정보
 */
export interface CountryField {
  fieldId: number; // ✅ ID는 필수
  fieldName: string | null;
  value: string | number | null;
  type: FieldType | null;
}

/**
 * 대학 정보 (간단 버전)
 */
export interface UniversitySimple {
  univId: number; // ✅ ID는 필수
  nameKo: string | null;
  nameEn: string | null;
  logoUrl: string | null;
}

/**
 * 국가 상세 정보 응답
 */
export interface CountryDetailResponse {
  countryCode: string; // ✅ ID 역할
  name: string | null;
  data: CountryField[] | null;
  universities: UniversitySimple[] | null;
}
