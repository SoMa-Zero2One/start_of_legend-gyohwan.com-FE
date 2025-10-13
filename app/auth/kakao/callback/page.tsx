'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { validateState, cleanupOAuthSession } from '@/lib/oauth/config';
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
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) {
          setError('서버 환경변수가 올바르게 설정되지 않았습니다. (NEXT_PUBLIC_BACKEND_URL 누락)');
          cleanupOAuthSession();
          setTimeout(() => router.push('/log-in-or-create-account'), 2000);
          return;
        }

        const response = await fetch(
          `${backendUrl}/v1/auth/login/social/kakao`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `로그인에 실패했습니다. (HTTP ${response.status})${errorText ? `: ${errorText}` : ''}`
          );
        }

        const data: AuthSuccessResponse = await response.json();

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm space-y-6 text-center">
        {error ? (
          <>
            <div className="text-red-500">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium">{error}</p>
              <p className="text-sm text-gray-600 mt-2">
                잠시 후 로그인 페이지로 이동합니다...
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
            <h2 className="text-xl font-semibold text-gray-900">
              로그인 처리 중...
            </h2>
            <p className="text-sm text-gray-600">
              카카오 계정으로 로그인하고 있습니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function KakaoCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-900 mt-4">
            로딩 중...
          </h2>
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
