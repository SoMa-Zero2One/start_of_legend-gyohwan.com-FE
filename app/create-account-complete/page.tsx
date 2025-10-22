"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserMe } from "@/lib/api/user";
import { getRedirectUrl, clearRedirectUrl, saveRedirectUrl } from "@/lib/utils/redirect";
import Header from "@/components/layout/Header";
import { User } from "@/types/user";

export default function CreateAccountComplete() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserMe();
        setUser(userData);

        // 리다이렉트 URL 확인
        const storedRedirectUrl = getRedirectUrl();
        setRedirectUrl(storedRedirectUrl);
      } catch (err) {
        console.error("User info fetch error:", err);
        setError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-error-red">{error}</p>
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
