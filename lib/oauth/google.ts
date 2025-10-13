import { getOAuthConfig, generateState } from './config';

/**
 * Google OAuth URL을 생성합니다
 */
export const buildGoogleAuthUrl = (): string => {
  const config = getOAuthConfig('google');
  const state = generateState();

  // state를 세션 스토리지에 저장 (CSRF 방지)
  sessionStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/userinfo.email profile',
    state,
  });

  return `${config.authorizationEndpoint}?${params.toString()}`;
};

/**
 * 리다이렉트 방식으로 Google 로그인을 시작합니다
 */
export const initiateGoogleLogin = (): void => {
  const authUrl = buildGoogleAuthUrl();
  window.location.href = authUrl;
};
