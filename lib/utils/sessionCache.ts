/**
 * SessionStorage 기반 캐시 유틸리티
 *
 * USAGE: CommunityClient에서 Country/University 데이터 캐싱
 *
 * WHAT: Stale-While-Revalidate 패턴을 위한 sessionStorage 래퍼
 *
 * WHY:
 * - 첫 방문 후 재방문 시 즉시 렌더링 (0.1초)
 * - 탭 전환 시 불필요한 API 재요청 방지
 * - 백그라운드에서 최신 데이터 갱신
 */

interface CacheData<T> {
  data: T;
  timestamp: number;
}

const CACHE_KEYS = {
  COUNTRIES: "community_countries",
  UNIVERSITIES: "community_universities",
} as const;

/**
 * SessionStorage에서 캐시된 데이터 가져오기
 *
 * @param key - 캐시 키
 * @returns 캐시된 데이터 또는 null
 */
export function getCachedData<T>(key: keyof typeof CACHE_KEYS): T | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = sessionStorage.getItem(CACHE_KEYS[key]);
    if (!cached) return null;

    const { data } = JSON.parse(cached) as CacheData<T>;
    return data;
  } catch (error) {
    console.error(`[SessionCache] Failed to get cached data for ${key}:`, error);
    return null;
  }
}

/**
 * SessionStorage에 데이터 캐싱
 *
 * @param key - 캐시 키
 * @param data - 저장할 데이터
 */
export function setCachedData<T>(key: keyof typeof CACHE_KEYS, data: T): void {
  if (typeof window === "undefined") return;

  try {
    const cacheData: CacheData<T> = {
      data,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(CACHE_KEYS[key], JSON.stringify(cacheData));
  } catch (error) {
    console.error(`[SessionCache] Failed to cache data for ${key}:`, error);
  }
}

/**
 * 캐시 무효화 (삭제)
 *
 * @param key - 캐시 키
 */
export function invalidateCache(key: keyof typeof CACHE_KEYS): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(CACHE_KEYS[key]);
  } catch (error) {
    console.error(`[SessionCache] Failed to invalidate cache for ${key}:`, error);
  }
}

/**
 * 모든 캐시 삭제
 */
export function clearAllCache(): void {
  if (typeof window === "undefined") return;

  try {
    Object.values(CACHE_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
    });
  } catch (error) {
    console.error("[SessionCache] Failed to clear all cache:", error);
  }
}
