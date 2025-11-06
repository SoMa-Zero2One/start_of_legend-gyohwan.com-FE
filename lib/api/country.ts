import type { CountryDetailResponse } from "@/types/country";
import { getBackendUrl } from "@/lib/utils/api";
import { parseApiError } from "@/lib/utils/apiError";

/**
 * 국가 상세 정보 조회 (대학 목록 포함)
 * @param countryCode - 국가 코드 (예: "US", "JP")
 * @returns 국가 상세 정보 및 대학 목록
 * @throws {Error} API 호출 실패 시
 */
export const getCountryDetail = async (countryCode: string): Promise<CountryDetailResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/countries/${countryCode}`, {
    method: "GET",
    credentials: "omit", // 인증 불필요
  });

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};
