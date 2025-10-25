/**
 * 지망 선택 정보 (슬롯 ID만 포함)
 */
export interface ApplicationChoice {
  choice: number;
  slotId: number;
}

/**
 * 지원서 제출 요청
 */
export interface SubmitApplicationRequest {
  extraScore: number;
  gpaId: number;
  languageId: number;
  choices: ApplicationChoice[];
}

/**
 * 지원서 수정 요청 (지망 대학 재선택)
 */
export interface UpdateApplicationRequest {
  choices: ApplicationChoice[];
}
