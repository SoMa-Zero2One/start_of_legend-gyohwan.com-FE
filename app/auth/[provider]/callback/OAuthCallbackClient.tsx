"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { validateState, cleanupOAuthSession } from "@/lib/oauth/config";
import { loginWithGoogle, loginWithKakao } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { trackEvent } from "@/lib/analytics/gtag";
import { getRedirectUrl, clearRedirectUrl } from "@/lib/utils/redirect";
import { handleApiError } from "@/lib/utils/apiError";

interface OAuthCallbackClientProps {
  provider: "google" | "kakao";
}

// Provider별 로그인 함수 매핑 (컴포넌트 외부로 이동)
const LOGIN_FUNCTIONS = {
  google: loginWithGoogle,
  kakao: loginWithKakao,
} as const;

export default function OAuthCallbackClient({ provider }: OAuthCallbackClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    // Warning: exhaustive-deps 경고 해결 (방법 C 선택)
    // providerName을 useEffect 내부로 이동하여 dependency 문제 해결
    // 이유: providerName은 provider에서 파생되는 값이므로 내부에서 계산하면
    //       dependency array에 provider만 포함하면 되어 더 명확함
    const providerName = provider === "google" ? "구글" : "카카오";

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
            trackEvent("gate_redirect", {
              reason: "school_verification_required",
              from_path: redirectUrl,
              target_path: "/school-verification",
            });
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
        // 모든 에러 타입 처리 (네트워크 에러, API 에러 등)
        const errorMessage = handleApiError(error);
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
