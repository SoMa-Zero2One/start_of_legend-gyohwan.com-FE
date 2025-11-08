"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import KakaoLoginButton from "@/components/auth/KakaoLoginButton";
import EmailLoginForm from "@/components/auth/EmailLoginForm";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import TermsAgreement from "@/components/auth/TermsAgreement";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/stores/authStore";

export default function LoginOrCreateAccount() {
  const router = useRouter();
  const { isLoggedIn, user, isLoading: authLoading } = useAuthStore();

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    // authStore 로딩 완료 후에만 체크
    if (authLoading) return;

    if (isLoggedIn && user) {
      router.push("/");
    }
  }, [isLoggedIn, user, router, authLoading]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="로그인" showPrevButton showHomeButton showBorder />
      <div className="flex flex-1 flex-col items-center justify-between pt-[60px] pb-[36px]">
        <div className="flex w-full flex-col items-center gap-[24px] px-[20px]">
          <div className="flex w-full flex-col justify-center gap-[60px]">
            {/* 헤더 */}
            <div className="head-4 text-center">
              <h1>교환닷컴에 오신 걸 환영합니다</h1>
            </div>

            <div className="flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[8px] pb-[20px]">
                {/* 구글 로그인 */}
                <GoogleLoginButton />

                {/* 카카오 로그인 */}
                <KakaoLoginButton />
              </div>

              {/* 구분선 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-gray-700">또는</span>
                </div>
              </div>

              {/* 이메일 로그인 */}
              <EmailLoginForm />
            </div>
          </div>
        </div>
        {/* 약관 동의 */}
        <TermsAgreement />
      </div>
    </div>
  );
}
