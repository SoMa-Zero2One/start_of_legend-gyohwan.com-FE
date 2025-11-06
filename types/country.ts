/**
 * 국가 정보 타입
 */

/**
 * 필드 타입
 */
export type FieldType = "LEVEL" | "STRING" | "NUMBER";

/**
 * 국가 필드 정보
 */
export interface CountryField {
  fieldId: number;
  fieldName: string;
  value: string | number | null;
  type: FieldType;
}

/**
 * 대학 정보 (간단 버전)
 */
export interface UniversitySimple {
  univId: number;
  nameKo: string | null;
  nameEn: string;
  logoUrl: string | null;
}

/**
 * 국가 상세 정보 응답
 */
export interface CountryDetailResponse {
  countryCode: string;
  name: string;
  data: CountryField[];
  universities: UniversitySimple[];
}
