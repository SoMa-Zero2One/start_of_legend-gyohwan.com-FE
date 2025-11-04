import type { CountryApiResponse, UniversityApiResponse } from "@/types/community";
import { getBackendUrl } from "@/lib/utils/api";

/**
 * 나라 목록 조회 (GET /v1/windows/countries)
 * @returns 나라 목록 (동적 필드 포함)
 * @throws {Error} API 호출 실패 시
 */
export const fetchCountries = async (): Promise<CountryApiResponse[]> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/countries`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`나라 목록 조회 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};

/**
 * 대학 목록 조회 (GET /v1/windows/universities)
 * @returns 대학 목록 (동적 필드 포함)
 * @throws {Error} API 호출 실패 시
 */
export const fetchUniversities = async (): Promise<UniversityApiResponse[]> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/universities`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`대학 목록 조회 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};
