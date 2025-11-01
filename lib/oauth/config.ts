import type { OAuthConfig, OAuthProvider } from "@/types/auth";

/**
 * OAuth 설정을 가져옵니다
 */
export const getOAuthConfig = (provider: OAuthProvider): OAuthConfig => {
  const configs: Record<
    OAuthProvider,
    {
      clientId: string | undefined;
      redirectUri: string | undefined;
      authorizationEndpoint: string;
    }
  > = {
    kakao: {
      clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
      redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
      authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
    },
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    },
  };

  const config = configs[provider];

  if (!config.clientId || !config.redirectUri) {
    throw new Error(`${provider} OAuth 환경변수가 설정되지 않았습니다.`);
  }

  return {
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    authorizationEndpoint: config.authorizationEndpoint,
  };
};

function uint8ArrayToBase64(bytes: Uint8Array): string {
  // Browser-safe base64 encoding
  return btoa(String.fromCharCode(...bytes));
}

/**
 * CSRF 방지를 위한 랜덤 state 생성
 */
export const generateState = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return uint8ArrayToBase64(array);
};

/**
 * State 값을 검증합니다 (CSRF 방지)
 */
export const validateState = (state: string): boolean => {
  const savedState = sessionStorage.getItem("oauth_state");
  return savedState === state;
};

/**
 * OAuth 관련 세션 스토리지를 정리합니다
 */
export const cleanupOAuthSession = (): void => {
  sessionStorage.removeItem("oauth_state");
};

/**
 * 공통 OAuth URL 생성 함수
 * @param provider - OAuth 제공자 (google, kakao)
 * @param additionalParams - 추가 파라미터 (scope 등)
 */
export const buildOAuthUrl = (provider: OAuthProvider, additionalParams?: Record<string, string>): string => {
  const config = getOAuthConfig(provider);
  const state = generateState();

  // state를 세션 스토리지에 저장 (CSRF 방지)
  sessionStorage.setItem("oauth_state", state);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    state,
    ...additionalParams,
  });

  return `${config.authorizationEndpoint}?${params.toString()}`;
};

/**
 * OAuth 로그인을 시작합니다 (리다이렉트 방식)
 * @param provider - OAuth 제공자 (google, kakao)
 * @param additionalParams - 추가 파라미터 (scope 등)
 */
export const initiateOAuthLogin = (provider: OAuthProvider, additionalParams?: Record<string, string>): void => {
  const authUrl = buildOAuthUrl(provider, additionalParams);
  window.location.href = authUrl;
};
