/**
 * 커뮤니티 관련 타입 정의
 *
 * API 응답 타입 (CountryApiResponse, UniversityApiResponse):
 * - ID 필드 외 null 가능 (방어적 코딩)
 * - null 의미: 데이터 미제공, 누락, 오류 상황
 * - 처리 방법: Transform 레이어에서 기본값으로 변환
 *
 * Enriched 타입 (EnrichedCountry, EnrichedUniversity):
 * - 변환 후 안전한 상태 (null 없음)
 * - Transform 레이어에서 방어 처리 완료
 * - 컴포넌트에서 안전하게 사용 가능
 *
 * FieldMetadata:
 * - 프론트엔드에서 정의하는 메타데이터 (항상 안전한 값)
 */

// ==================== 공통 타입 ====================

// 대륙 타입
export type Continent = "아시아" | "유럽" | "북아메리카" | "남아메리카" | "아프리카" | "오세아니아";

export const CONTINENTS: Continent[] = ["아시아", "유럽", "북아메리카", "남아메리카", "아프리카", "오세아니아"];
// ==================== 하이브리드 방식 타입 ====================

// 필드 메타데이터 인터페이스
export interface FieldMetadata {
  fieldId: number; // 백엔드 API 필드 식별자 (고정값)
  key: string; // 프론트엔드 내부 키 (정렬/필터에 사용)
  label: string; // 화면 표시명
  type: "level" | "string" | "number"; // 백엔드 타입과 매칭
  sortable: boolean;
  defaultVisible: boolean;
  displayOrder: number; // 화면 표시 순서 (낮을수록 앞에 표시)
  renderConfig?: {
    minWidth?: string;
    badge?: boolean; // STRING 타입을 배지로 렌더링할지 여부
    levelMax?: number; // LEVEL 타입의 최대값
  };
}

// 백엔드 API 응답 타입 (방어적 코딩: ID 외 nullable)
export interface CountryApiResponse {
  countryCode: string; // ✅ ID 역할
  name: string | null;
  data: Array<{
    fieldId: number; // ✅ ID는 필수
    fieldName: string | null;
    value: string | null;
    type: "LEVEL" | "STRING" | "NUMBER" | null;
  }> | null;
}

// 프론트엔드 통합 형식 (변환 후 안전한 상태)
export interface EnrichedCountry {
  countryCode: string;
  name: string;
  continent: string; // 필터 전용 (테이블에 표시 안 함)
  fields: Map<string, CountryFieldValue>; // key → value 매핑
  rawData: Array<{
    fieldId: number;
    fieldName: string | null;
    value: string | null;
    type: "LEVEL" | "STRING" | "NUMBER" | null;
  }>; // 변환 레이어에서 항상 배열로 보장
}

export interface CountryFieldValue {
  fieldId: number;
  key: string; // "visaDifficulty"
  label: string; // "비자 발급 난이도"
  value: string; // "1~5"
  displayValue: string; // "상" (변환된 값)
  numericValue?: number; // 정렬용 숫자값
  type: FieldMetadata["type"];
  sortable: boolean; // 정렬 가능 여부
  displayOrder: number; // 화면 표시 순서
  renderConfig?: FieldMetadata["renderConfig"]; // 렌더링 설정
}

// ==================== 대학 탭 타입 ====================

// 백엔드 API 응답 타입 (대학) (방어적 코딩: ID 외 nullable)
export interface UniversityApiResponse {
  univId: number; // ✅ ID는 필수
  name: string | null;
  countryName: string | null;
  isFavorite: boolean | null;
  logoUrl: string | null;
  data: Array<{
    fieldId: number; // ✅ ID는 필수
    fieldName: string | null;
    value: string | null;
    type: "LEVEL" | "STRING" | "NUMBER" | null;
  }> | null;
}

// 프론트엔드 통합 형식 (대학) (변환 후 안전한 상태)
export interface EnrichedUniversity {
  univId: number;
  name: string;
  countryName: string; // 원본 보존
  continent: string; // 대륙 (필터 전용, fieldName으로 추출)
  isFavorite: boolean;
  logoUrl: string; // 대학 로고 URL
  fields: Map<string, UniversityFieldValue>; // key → value 매핑 (countryName도 "country" 키로 포함)
  rawData: Array<{
    fieldId: number;
    fieldName: string | null;
    value: string | null;
    type: "LEVEL" | "STRING" | "NUMBER" | null;
  }>; // 변환 레이어에서 항상 배열로 보장
}

// 대학 필드 값
export interface UniversityFieldValue {
  fieldId: number; // 0이면 countryName (프론트 전용)
  key: string; // "country", "priceIndex", "qsRanking", etc.
  label: string; // "나라", "물가지수", "QS 랭킹", etc.
  value: string | null; // "미국", "23", null 등
  displayValue: string; // 변환된 값 (null이면 빈 문자열)
  numericValue?: number; // 정렬용 숫자값
  type: FieldMetadata["type"];
  sortable: boolean;
  displayOrder: number;
  renderConfig?: FieldMetadata["renderConfig"];
}
