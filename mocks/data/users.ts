import type { User } from '@/types/user';
import type { Gpa, Language } from '@/types/grade';

/**
 * Mock 유저 데이터
 * 다양한 상황을 테스트하기 위한 유저들
 */

// 기본 유저 (로그인된 상태)
export const mockCurrentUser: User = {
  userId: 1,
  email: 'test@example.com',
  schoolEmail: 'test@univ.ac.kr',
  nickname: '테스트유저',
  domesticUniversity: '교환대학교',
  schoolVerified: true,
  loginType: 'BASIC',
  socialType: null,
};

// 학교 인증 안된 유저
export const mockUnverifiedUser: User = {
  userId: 2,
  email: 'unverified@example.com',
  schoolEmail: null,
  nickname: '미인증유저',
  domesticUniversity: null,
  schoolVerified: false,
  loginType: 'BASIC',
  socialType: null,
};

// 소셜 로그인 유저 (카카오)
export const mockKakaoUser: User = {
  userId: 3,
  email: null,
  schoolEmail: 'kakao@univ.ac.kr',
  nickname: '카카오유저',
  domesticUniversity: '교환대학교',
  schoolVerified: true,
  loginType: 'SOCIAL',
  socialType: 'KAKAO',
  profileUrl: 'https://example.com/profile.jpg',
};

// 구글 로그인 유저
export const mockGoogleUser: User = {
  userId: 4,
  email: null,
  schoolEmail: 'google@univ.ac.kr',
  nickname: '구글유저',
  domesticUniversity: '교환대학교',
  schoolVerified: true,
  loginType: 'SOCIAL',
  socialType: 'GOOGLE',
};

// 전체 유저 목록 (userId로 조회 가능)
export const mockUsers: Record<number, User> = {
  1: mockCurrentUser,
  2: mockUnverifiedUser,
  3: mockKakaoUser,
  4: mockGoogleUser,
};

/**
 * Mock GPA 데이터
 */
export const mockGpas: Record<number, Gpa[]> = {
  1: [
    {
      gpaId: 1,
      score: 4.21,
      criteria: '4.5',
      verifyStatus: 'APPROVED',
      statusReason: null,
    },
    {
      gpaId: 2,
      score: 3.8,
      criteria: '4.3',
      verifyStatus: 'APPROVED',
      statusReason: null,
    },
  ],
  2: [
    {
      gpaId: 3,
      score: 3.5,
      criteria: '4.5',
      verifyStatus: 'PENDING',
      statusReason: null,
    },
  ],
  3: [
    {
      gpaId: 4,
      score: 4.0,
      criteria: '4.3',
      verifyStatus: 'APPROVED',
      statusReason: null,
    },
  ],
  4: [
    {
      gpaId: 5,
      score: 3.9,
      criteria: '4.0',
      verifyStatus: 'REJECTED',
      statusReason: '증빙 자료가 불충분합니다.',
    },
  ],
};

/**
 * Mock Language 데이터
 */
export const mockLanguages: Record<number, Language[]> = {
  1: [
    {
      languageId: 1,
      testType: 'TOEIC',
      score: '900',
      grade: 'A',
      verifyStatus: 'APPROVED',
      statusReason: null,
    },
    {
      languageId: 2,
      testType: 'TOEFL_IBT',
      score: '105',
      grade: null,
      verifyStatus: 'APPROVED',
      statusReason: null,
    },
  ],
  2: [
    {
      languageId: 3,
      testType: 'IELTS',
      score: '7.5',
      grade: null,
      verifyStatus: 'PENDING',
      statusReason: null,
    },
  ],
  3: [
    {
      languageId: 4,
      testType: 'TOEIC',
      score: '850',
      grade: 'B',
      verifyStatus: 'APPROVED',
      statusReason: null,
    },
  ],
  4: [
    {
      languageId: 5,
      testType: 'JLPT',
      score: null,
      grade: 'N1',
      verifyStatus: 'APPROVED',
      statusReason: null,
    },
  ],
};

/**
 * Mock 이메일-비밀번호 저장소 (로그인 테스트용)
 */
export const mockCredentials: Record<string, string> = {
  'test@example.com': 'password123456',
  'unverified@example.com': 'password123456',
  'existing@example.com': 'password123456', // 이미 가입된 이메일 테스트용
};

/**
 * Mock 이메일 인증 코드 저장소 (회원가입/학교인증 테스트용)
 */
export const mockVerificationCodes: Record<string, string> = {
  'test@example.com': '123456',
  'newuser@example.com': '654321',
  'test@univ.ac.kr': '111111',
};

/**
 * 현재 로그인된 유저 ID (전역 상태 시뮬레이션)
 */
export let currentUserId: number | null = null;

export function setCurrentUserId(userId: number | null) {
  currentUserId = userId;
}

export function getCurrentUser(): User | null {
  if (currentUserId === null) return null;
  return mockUsers[currentUserId] || null;
}
