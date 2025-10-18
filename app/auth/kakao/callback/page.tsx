'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { validateState, cleanupOAuthSession } from '@/lib/oauth/config';
import { loginWithKakao } from '@/lib/api/auth';
import type { AuthSuccessResponse } from '@/types/auth';

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('카카오 로그인이 취소되었습니다.');
        cleanupOAuthSession();
        setTimeout(() => router.push('/log-in-or-create-account'), 2000);
        return;
      }

      if (!code || !state) {
        setError('인증 코드를 받지 못했습니다.');
        cleanupOAuthSession();
        setTimeout(() => router.push('/log-in-or-create-account'), 2000);
        return;
      }

      // CSRF 방어: state 검증
      if (!validateState(state)) {
        setError('잘못된 요청입니다. (CSRF 검증 실패)');
        cleanupOAuthSession();
        setTimeout(() => router.push('/log-in-or-create-account'), 2000);
        return;
      }

      try {
        // 백엔드로 인증 코드 전송
        const data: AuthSuccessResponse = await loginWithKakao(code);

        // 토큰 저장 (sessionStorage: 브라우저 닫으면 자동 로그아웃)
        if (data.accessToken) {
          sessionStorage.setItem('accessToken', data.accessToken);
          if (data.refreshToken) {
            sessionStorage.setItem('refreshToken', data.refreshToken);
          }
        }

        // OAuth 세션 정리
        cleanupOAuthSession();

        // 로그인 성공 후 리다이렉트
        router.push('/');
      } catch (err) {
        console.error('Kakao login error:', err);
        setError('로그인 처리 중 오류가 발생했습니다.');
        cleanupOAuthSession();
        setTimeout(() => router.push('/log-in-or-create-account'), 2000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  // 에러가 있을 때만 UI 표시, 정상 처리는 빈 화면
  if (!error) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-[#FF4242] text-center">
        <p className="text-lg font-medium">{error}</p>
        <p className="text-sm text-gray-600 mt-2">
          잠시 후 로그인 페이지로 이동합니다...
        </p>
      </div>
    </div>
  );
}

export default function KakaoCallback() {
  return (
    <Suspense fallback={null}>
      <KakaoCallbackContent />
    </Suspense>
  );
}
