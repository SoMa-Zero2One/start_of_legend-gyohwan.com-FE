"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { validateState, cleanupOAuthSession } from "@/lib/oauth/config";
import { loginWithKakao } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/authStore";

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError("카카오 로그인이 취소되었습니다.");
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
        await loginWithKakao(code);

        // OAuth 세션 정리
        cleanupOAuthSession();

        // 사용자 정보 가져오기
        await fetchUser();

        // 로그인 성공 후 리다이렉트
        router.push("/");
      } catch (err) {
        console.error("Kakao login error:", err);
        setError("로그인 처리 중 오류가 발생했습니다.");
        cleanupOAuthSession();
        setTimeout(() => router.push("/log-in-or-create-account"), 2000);
      }
    };

    handleCallback();
  }, [searchParams, router, fetchUser]);

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

export default function KakaoCallback() {
  return (
    <Suspense fallback={null}>
      <KakaoCallbackContent />
    </Suspense>
  );
}
