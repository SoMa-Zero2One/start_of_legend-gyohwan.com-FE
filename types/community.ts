// 대륙 타입
export type Continent = "아시아" | "유럽" | "북아메리카" | "남아메리카" | "아프리카" | "오세아니아";

// 난이도 타입
export type Difficulty = "하" | "중" | "상";

// 비용 타입
export type CostLevel = "낮음" | "중간" | "높음";

// 있음/없음 타입
export type Availability = "있음" | "없음";

// 좋음/보통/나쁨 타입
export type Quality = "좋음" | "보통" | "나쁨";

// 도시/시골 타입
export type CityType = "도시" | "시골";

// 국공립 여부
export type SchoolType = "국립" | "공립" | "사립";

// 커뮤니티 - 나라
export interface CommunityCountry {
  name: string;
  continent: Continent;
  visaDifficulty: Difficulty;
  cost: CostLevel;
  language: string;
}

// 커뮤니티 - 대학
export interface CommunityUniversity {
  id: number;
  name: string;
  englishName: string;
  country: string;
  continent: Continent;
  logoUrl?: string | null;
  // 값 필터 속성들 (컬럼으로 표시)
  budget: string; // "1,000만원 이상", "500만원 이상" 등
  travel: Quality;
  cost: CostLevel;
  program: Availability;
  cityType: CityType;
  safety: Quality;
  transportation: Quality;
  dorm: Availability;
  dormCost: string; // "300만원", "200만원" 등
  qsRanking: string; // "100위 이내", "500위 이내" 등
  schoolType: SchoolType;
}

// 나라 탭 필터 옵션
export interface CountryFilterOptions {
  // 분류 필터 (표시 여부 결정)
  continent?: Continent | null;
  // 값 필터 (컬럼 표시 여부)
  showVisaDifficulty: boolean;
  showCost: boolean;
  showLanguage: boolean;
}

// 대학 탭 필터 옵션
export interface UniversityFilterOptions {
  // 분류 필터 (표시 여부 결정)
  continent?: Continent | null;
  // 값 필터 (컬럼 표시 여부)
  showBudget: boolean;
  showTravel: boolean;
  showCost: boolean;
  showProgram: boolean;
  showCityType: boolean;
  showSafety: boolean;
  showTransportation: boolean;
  showDorm: boolean;
  showDormCost: boolean;
  showQsRanking: boolean;
  showSchoolType: boolean;
}

// 테이블 컬럼 정의
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

// ==================== Option 3: 하이브리드 방식 타입 ====================

// 필드 메타데이터 인터페이스
export interface FieldMetadata {
  fieldId: number;
  key: string; // 프론트엔드 내부 키 (정렬/필터에 사용)
  label: string; // 화면 표시명
  type: "level" | "string" | "number"; // 백엔드 타입과 매칭
  sortable: boolean;
  defaultVisible: boolean;
  renderConfig?: {
    minWidth?: string;
    badge?: boolean; // STRING 타입을 배지로 렌더링할지 여부
    levelMax?: number; // LEVEL 타입의 최대값
  };
}

// 백엔드 API 응답 타입
export interface CountryApiResponse {
  countryCode: string;
  name: string;
  data: Array<{
    fieldId: number;
    fieldName: string;
    value: string;
    type: "LEVEL" | "STRING" | "NUMBER";
  }>;
}

// 프론트엔드 통합 형식
export interface EnrichedCountry {
  countryCode: string;
  name: string;
  continent: string; // 필터 전용 (테이블에 표시 안 함)
  fields: Map<string, CountryFieldValue>; // key → value 매핑
  rawData: CountryApiResponse["data"]; // 원본 보존 (디버깅용)
}

export interface CountryFieldValue {
  fieldId: number;
  key: string; // "visaDifficulty"
  label: string; // "비자 발급 난이도"
  value: string; // "1~5"
  displayValue: string; // "상" (변환된 값)
  numericValue?: number; // 정렬용 숫자값
  type: FieldMetadata["type"];
  renderConfig?: FieldMetadata["renderConfig"]; // 렌더링 설정
}
