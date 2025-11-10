import type { CountryDetailResponse } from "@/types/country";
import { getBackendUrl } from "@/lib/utils/api";
import { parseApiError } from "@/lib/utils/apiError";

interface GetCountryDetailOptions {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  cache?: RequestCache;
}

/**
 * USAGE: 국가 상세 정보 조회 (대학 목록 포함)
 *
 * WHAT: GET /v1/windows/countries/{countryCode}
 *
 * WHY:
 * - 다양한 페이지에서 사용되며 각각 다른 캐시 전략 필요
 * - options로 캐시 전략을 호출부에서 선택 가능
 * - 기본값: no-store (실시간성 우선)
 * - ⚠️ cache와 next는 상호 배타적 (동시 사용 불가)
 *
 * USAGE EXAMPLES:
 * - 커뮤니티 페이지: getCountryDetail("US") → cache: "no-store" (실시간)
 * - 대학 목록 페이지: getCountryDetail("US", { next: { revalidate: 3600 } }) → 1시간 캐시
 * - 태그 기반 재검증: getCountryDetail("US", { next: { tags: ["countries"] } })
 * - 명시적 캐싱: getCountryDetail("US", { cache: "force-cache" }) → 강제 캐시
 *
 * ALTERNATIVES:
 * - 별도 API 함수 생성 (rejected: 코드 중복)
 *
 * @param countryCode - 국가 코드 (예: "US", "JP")
 * @param options - fetch 옵션 (cache 또는 next 중 하나만 사용, next는 revalidate/tags 지원)
 * @returns 국가 상세 정보 및 대학 목록
 * @throws {Error} API 호출 실패 시
 */
export const getCountryDetail = async (
  countryCode: string,
  options?: GetCountryDetailOptions
): Promise<CountryDetailResponse> => {
  const backendUrl = getBackendUrl();

  // cache와 next는 상호 배타적: next가 있으면 cache 설정 안 함
  const fetchOptions: RequestInit = {
    method: "GET",
    credentials: "omit", // 인증 불필요
  };

  if (options?.next) {
    // next.revalidate 사용 시 cache 설정 제외
    fetchOptions.next = options.next;
  } else {
    // next 없으면 cache 사용 (기본: no-store)
    fetchOptions.cache = options?.cache ?? "no-store";
  }

  const response = await fetch(`${backendUrl}/v1/windows/countries/${countryCode}`, fetchOptions);

  if (!response.ok) {
    const errorMessage = await parseApiError(response);
    throw new Error(errorMessage);
  }

  return await response.json();
};
