/**
 * 사용자 정보 타입
 */
export interface User {
  userId: number;
  email: string;
  schoolEmail: string | null;
  nickname: string;
  domesticUniversity: string | null;
  schoolVerified: boolean;
  loginType: 'BASIC' | 'SOCIAL';
  socialType: string | null;
}
