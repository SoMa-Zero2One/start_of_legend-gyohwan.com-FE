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
