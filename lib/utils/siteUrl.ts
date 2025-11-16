const PROD_FALLBACK_URL = "https://www.gyohwan.com";
const LOCAL_URL = "http://localhost:3000";

/**
 * Canonical 사이트 URL을 반환.
 * 1. NEXT_PUBLIC_SITE_URL (명시적 설정)
 * 2. 개발 환경이면 localhost
 * 3. 프로덕션 기본값 (https://www.gyohwan.com)
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.NODE_ENV === "development") {
    return LOCAL_URL;
  }

  return PROD_FALLBACK_URL;
}
