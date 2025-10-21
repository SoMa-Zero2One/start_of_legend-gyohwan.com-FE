/**
 * 사용자 정보 타입
 */
export interface User {
  userId: number;
  email: string | null;
  schoolEmail: string | null;
  nickname: string;
  domesticUniversity: string | null;
  schoolVerified: boolean;
  loginType: 'BASIC' | 'SOCIAL';
  socialType: string | null;
  profileUrl?: string | null;
}
