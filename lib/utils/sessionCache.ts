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

export const CACHE_KEYS = {
  COUNTRIES: "community_countries",
  UNIVERSITIES: "community_universities",
} as const;

type CacheKey = keyof typeof CACHE_KEYS | string;

const isPredefinedKey = (key: string): key is keyof typeof CACHE_KEYS =>
  Object.prototype.hasOwnProperty.call(CACHE_KEYS, key);

const resolveCacheKey = (key: CacheKey): string => {
  if (typeof key === "string" && !isPredefinedKey(key)) {
    return key;
  }
  const normalizedKey = key as keyof typeof CACHE_KEYS;
  return CACHE_KEYS[normalizedKey];
};

/**
 * SessionStorage에서 캐시된 데이터 가져오기
 *
 * @param key - 캐시 키
 * @returns 캐시된 데이터 또는 null
 */
export function getCachedData<T>(key: CacheKey): T | null {
  if (typeof window === "undefined") return null;

  try {
    const cacheKey = resolveCacheKey(key);
    const cached = sessionStorage.getItem(cacheKey);
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
export function setCachedData<T>(key: CacheKey, data: T): void {
  if (typeof window === "undefined") return;

  try {
    const cacheData: CacheData<T> = {
      data,
      timestamp: Date.now(),
    };
    const cacheKey = resolveCacheKey(key);
    sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error(`[SessionCache] Failed to cache data for ${key}:`, error);
  }
}

/**
 * 캐시 무효화 (삭제)
 *
 * @param key - 캐시 키
 */
export function invalidateCache(key: CacheKey): void {
  if (typeof window === "undefined") return;

  try {
    const cacheKey = resolveCacheKey(key);
    sessionStorage.removeItem(cacheKey);
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
