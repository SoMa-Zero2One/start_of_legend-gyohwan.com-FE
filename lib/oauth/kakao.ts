import { buildOAuthUrl, initiateOAuthLogin } from './config';

/**
 * Kakao OAuth URL을 생성합니다
 */
export const buildKakaoAuthUrl = (): string => {
  return buildOAuthUrl('kakao');
};

/**
 * 리다이렉트 방식으로 Kakao 로그인을 시작합니다
 */
export const initiateKakaoLogin = (): void => {
  initiateOAuthLogin('kakao');
};
