import type { LanguagesResponse, CreateLanguageRequest, CreateLanguageResponse } from "@/types/grade";
import { getBackendUrl } from "@/lib/utils/api";
import { parseApiError } from "@/lib/utils/apiError";

/**
 * 사용자 어학 성적 정보 조회
 * @returns 어학 성적 목록
 * @throws {Error} API 호출 실패 시
 */
export const getLanguages = async (): Promise<LanguagesResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/users/me/languages`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * 어학 성적 정보 생성/수정
 * @param data - 어학 성적 정보
 * @returns 생성된 어학 성적 정보
 * @throws {Error} API 호출 실패 시
 */
export const createLanguage = async (data: CreateLanguageRequest): Promise<CreateLanguageResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/users/me/languages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};
