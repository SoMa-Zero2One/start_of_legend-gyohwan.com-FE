"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { validateState, cleanupOAuthSession } from "@/lib/oauth/config";
import { loginWithGoogle, loginWithKakao } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { getRedirectUrl, clearRedirectUrl } from "@/lib/utils/redirect";

interface OAuthCallbackContentProps {
  provider: "google" | "kakao";
}

// Provider별 로그인 함수 매핑 (컴포넌트 외부로 이동)
const LOGIN_FUNCTIONS = {
  google: loginWithGoogle,
  kakao: loginWithKakao,
} as const;

function OAuthCallbackContent({ provider }: OAuthCallbackContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  // Provider별 표시 이름
  const providerName = provider === "google" ? "구글" : "카카오";

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(`${providerName} 로그인이 취소되었습니다.`);
        cleanupOAuthSession();
        setTimeout(() => router.push("/log-in-or-create-account"), 2000);
        return;
      }

      if (!code || !state) {
        setError("인증 코드를 받지 못했습니다.");
        cleanupOAuthSession();
        setTimeout(() => router.push("/log-in-or-create-account"), 2000);
        return;
      }

      // CSRF 방어: state 검증
      if (!validateState(state)) {
        setError("잘못된 요청입니다. (CSRF 검증 실패)");
        cleanupOAuthSession();
        setTimeout(() => router.push("/log-in-or-create-account"), 2000);
        return;
      }

      try {
        // 백엔드로 인증 코드 전송 (쿠키로 accessToken 받음)
        await LOGIN_FUNCTIONS[provider](code);

        // OAuth 세션 정리
        cleanupOAuthSession();

        // 사용자 정보 가져오기
        await fetchUser();

        // 리다이렉트 URL 확인
        const redirectUrl = getRedirectUrl();

        if (redirectUrl) {
          const { user } = useAuthStore.getState();

          // 학교 인증 확인
          if (!user?.schoolVerified) {
            // 학교 인증 필요 - redirectUrl 유지하고 학교 인증 페이지로
            router.push("/school-verification");
          } else {
            // 학교 인증 완료 - redirectUrl로 이동
            clearRedirectUrl();
            router.push(redirectUrl);
          }
        } else {
          // redirectUrl 없으면 홈으로
          router.push("/");
        }
      } catch (error) {
        // 서버에서 받은 에러 메시지 표시
        const errorMessage = (error as Error).message;
        setError(errorMessage);
        cleanupOAuthSession();
        setTimeout(() => router.push("/log-in-or-create-account"), 2000);
      }
    };

    handleCallback();
  }, [searchParams, router, fetchUser, provider]);

  // 에러가 있을 때만 UI 표시, 정상 처리는 빈 화면
  if (!error) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-error-red text-center">
        <p className="body-1">{error}</p>
        <p className="mt-2 text-gray-700">잠시 후 로그인 페이지로 이동합니다...</p>
      </div>
    </div>
  );
}

export default function OAuthCallback({ params }: { params: { provider: string } }) {
  // Provider 유효성 검사 (타입 가드)
  const isValidProvider = (provider: string): provider is "google" | "kakao" => {
    return provider === "google" || provider === "kakao";
  };

  if (!isValidProvider(params.provider)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center text-red-500">
          <p className="body-1">지원하지 않는 로그인 방식입니다.</p>
        </div>
      </div>
    );
  }

  // 여기서는 params.provider가 "google" | "kakao" 타입으로 좁혀짐
  return (
    <Suspense fallback={null}>
      <OAuthCallbackContent provider={params.provider} />
    </Suspense>
  );
}
