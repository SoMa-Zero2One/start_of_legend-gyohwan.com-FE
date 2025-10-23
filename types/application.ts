/**
 * 학점 정보
 */
export interface Gpa {
  gpaId: number;
  score: number;
  criteria: string;
  verifyStatus: string;
  statusReason: string | null;
}

/**
 * 학점 조회 응답
 */
export interface GpasResponse {
  userId: number;
  gpas: Gpa[];
}

/**
 * 학점 생성 요청
 */
export interface CreateGpaRequest {
  score: number;
  criteria: number;
}

/**
 * 학점 생성 응답
 */
export interface CreateGpaResponse {
  gpaId: number;
  score: number;
  criteria: string;
  verifyStatus: string;
  statusReason: string | null;
}

/**
 * 어학 성적 정보
 */
export interface Language {
  languageId: number;
  testType: string;
  score: string | null;
  grade: string | null;
  verifyStatus: string;
  statusReason: string | null;
}

/**
 * 어학 성적 조회 응답
 */
export interface LanguagesResponse {
  userId: number;
  languages: Language[];
}

/**
 * 어학 성적 생성 요청
 */
export interface CreateLanguageRequest {
  testType: string;
  score: string;
  grade?: string;
}

/**
 * 어학 성적 생성 응답
 */
export interface CreateLanguageResponse {
  languageId: number;
  testType: string;
  score: string | null;
  grade: string | null;
  verifyStatus: string;
  statusReason: string | null;
}

/**
 * 지망 선택 정보
 */
export interface ApplicationChoice {
  choice: number;
  slotId: number;
  gpaId: number;
  languageId: number;
}

/**
 * 지원서 제출 요청
 */
export interface SubmitApplicationRequest {
  extraScore: number;
  choices: ApplicationChoice[];
}
