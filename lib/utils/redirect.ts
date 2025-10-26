/**
 * 리다이렉트 URL 관리 유틸리티
 * sessionStorage를 사용하여 로그인/인증 후 리다이렉트할 URL을 저장하고 관리합니다.
 * sessionStorage는 현재 탭에서만 유효하며, 탭을 닫으면 자동으로 삭제됩니다.
 * 10분 만료 기능을 포함합니다.
 */

const REDIRECT_STORAGE_KEY = "redirectAfterAuth";
const EXPIRATION_TIME = 10 * 60 * 1000; // 10분 (밀리초)

interface RedirectData {
  url: string;
  timestamp: number;
  expires: number;
}

/**
 * 리다이렉트 URL을 sessionStorage에 저장합니다.
 * @param url - 저장할 리다이렉트 URL
 */
export function saveRedirectUrl(url: string): void {
  const redirectData: RedirectData = {
    url,
    timestamp: Date.now(),
    expires: EXPIRATION_TIME,
  };

  sessionStorage.setItem(REDIRECT_STORAGE_KEY, JSON.stringify(redirectData));
}

/**
 * 저장된 리다이렉트 URL을 가져옵니다.
 * 만료되었거나 없으면 null을 반환합니다.
 * @returns 유효한 리다이렉트 URL 또는 null
 */
export function getRedirectUrl(): string | null {
  const stored = sessionStorage.getItem(REDIRECT_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const data: RedirectData = JSON.parse(stored);
    const isExpired = Date.now() - data.timestamp > data.expires;

    if (isExpired) {
      // 만료된 경우 삭제
      sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
      return null;
    }

    return data.url;
  } catch (error) {
    // 파싱 에러 시 삭제
    console.error("Failed to parse redirect data:", error);
    sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
    return null;
  }
}

/**
 * 저장된 리다이렉트 URL을 삭제합니다.
 */
export function clearRedirectUrl(): void {
  sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
}
