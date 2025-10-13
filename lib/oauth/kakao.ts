import { getOAuthConfig, generateState } from './config';

/**
 * Kakao OAuth URL을 생성합니다
 */
export const buildKakaoAuthUrl = (): string => {
  const config = getOAuthConfig('kakao');
  const state = generateState();

  // state를 세션 스토리지에 저장 (CSRF 방지)
  sessionStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    state,
  });

  return `${config.authorizationEndpoint}?${params.toString()}`;
};

/**
 * 리다이렉트 방식으로 Kakao 로그인을 시작합니다
 */
export const initiateKakaoLogin = (): void => {
  const authUrl = buildKakaoAuthUrl();
  window.location.href = authUrl;
};
