import { buildOAuthUrl, initiateOAuthLogin } from './config';

/**
 * Google OAuth URL을 생성합니다
 */
export const buildGoogleAuthUrl = (): string => {
  return buildOAuthUrl('google', {
    scope: 'https://www.googleapis.com/auth/userinfo.email profile',
  });
};

/**
 * 리다이렉트 방식으로 Google 로그인을 시작합니다
 */
export const initiateGoogleLogin = (): void => {
  initiateOAuthLogin('google', {
    scope: 'https://www.googleapis.com/auth/userinfo.email profile',
  });
};
