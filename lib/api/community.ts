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
 * 대학 목록 조회 (GET /v1/windows/outgoing-universities)
 * @returns 대학 목록 (동적 필드 포함, isFavorite 포함)
 * @throws {Error} API 호출 실패 시
 */
export const fetchUniversities = async (): Promise<UniversityApiResponse[]> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/outgoing-universities`, {
    method: "GET",
    credentials: "include", // 로그인 상태 확인을 위한 쿠키 전송
  });

  if (!response.ok) {
    throw new Error(`대학 목록 조회 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};

/**
 * 즐겨찾기 추가 (POST /v1/windows/outgoing-universities/{univId}/favorite)
 * @param univId 대학 ID
 * @throws {Error} API 호출 실패 시
 */
export const addFavorite = async (univId: number): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/outgoing-universities/${univId}/favorite`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`즐겨찾기 추가 실패 (HTTP ${response.status})`);
  }
};

/**
 * 즐겨찾기 삭제 (DELETE /v1/windows/outgoing-universities/{univId}/favorite)
 * @param univId 대학 ID
 * @throws {Error} API 호출 실패 시
 */
export const removeFavorite = async (univId: number): Promise<void> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/windows/outgoing-universities/${univId}/favorite`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`즐겨찾기 삭제 실패 (HTTP ${response.status})`);
  }
};
