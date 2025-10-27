"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRedirectUrl, clearRedirectUrl, saveRedirectUrl } from "@/lib/utils/redirect";
import { useAuthStore } from "@/stores/authStore";
import Header from "@/components/layout/Header";

export default function CreateAccountComplete() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading: authLoading, fetchUser } = useAuthStore();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // 회원가입 직후이므로 최신 사용자 정보 가져오기
  useEffect(() => {
    fetchUser();

    const storedRedirectUrl = getRedirectUrl();
    setRedirectUrl(storedRedirectUrl);
  }, [fetchUser]);

  // authStore 로딩 완료 후 로그인 체크
  useEffect(() => {
    if (authLoading) return;

    // 로그인 안 된 사용자는 로그인 페이지로
    if (!isLoggedIn || !user) {
      router.replace("/log-in-or-create-account");
    }
  }, [authLoading, isLoggedIn, user, router]);

  const handleGoToShare = () => {
    if (!redirectUrl || !user) return;

    // 학교 인증 확인
    if (!user.schoolVerified) {
      // 학교 인증 필요 - redirectUrl 다시 저장하고 학교 인증 페이지로
      saveRedirectUrl(redirectUrl);
      router.push("/school-verification");
    } else {
      // 학교 인증 완료 - 바로 목적지로
      clearRedirectUrl();
      router.push(redirectUrl);
    }
  };

  const handleGoHome = () => {
    clearRedirectUrl();
    router.push("/");
  };

  // authStore 로딩 중이거나 user 정보 없으면 로딩 표시
  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col items-center px-[20px]">
        <div className="flex w-[330px] flex-col items-center gap-[60px] pt-[60px]">
          {/* 헤더 */}
          <div className="flex flex-col items-center gap-[12px] text-center">
            <h1 className="head-4">
              {user?.nickname}님<br /> 환영합니다
            </h1>
            <p className="body-2 text-gray-900">교환학생 준비, 교환닷컴과 함께하세요.</p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex w-full flex-col gap-[12px]">
            {redirectUrl && (
              <button onClick={handleGoToShare} className="btn-primary w-full rounded-[4px] p-[12px]">
                성적 공유하러 가기 🚀
              </button>
            )}
            <button onClick={handleGoHome} className="btn-secondary w-full rounded-[4px] p-[12px]">
              홈으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
