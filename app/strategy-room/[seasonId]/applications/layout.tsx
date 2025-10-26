"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { saveRedirectUrl } from "@/lib/utils/redirect";

export default function ApplicationsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoggedIn, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    // authStore 로딩 완료 후에만 체크
    if (authLoading) return;

    const currentUrl = pathname;

    // 1. 로그인 체크
    if (!isLoggedIn || !user) {
      saveRedirectUrl(currentUrl);
      router.push("/log-in-or-create-account");
      return;
    }

    // 2. 학교 인증 체크
    if (!user.schoolVerified) {
      saveRedirectUrl(currentUrl);
      router.push("/school-verification");
      return;
    }
  }, [authLoading, isLoggedIn, user, router, pathname]);

  // 로딩 중이거나 인증 미완료 시 빈 화면 (리다이렉트 진행 중)
  if (authLoading || !isLoggedIn || !user || !user.schoolVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  // 모든 조건 충족 시 자식 컴포넌트 렌더링
  return <>{children}</>;
}
