"use client";

import { useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { trackEvent } from "@/lib/analytics/gtag";
import { saveRedirectUrl } from "@/lib/utils/redirect";

export default function ApplicationsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const seasonId = params.seasonId ? Number(params.seasonId) : undefined;
  const { user, isLoggedIn, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    // authStore 로딩 완료 후에만 체크
    if (authLoading) return;

    const currentUrl = pathname;

    // 1. 로그인 체크
    if (!isLoggedIn || !user) {
      trackEvent("gate_redirect", {
        reason: "login_required",
        from_path: currentUrl,
        target_path: "/log-in-or-create-account",
        season_id: seasonId,
      });
      saveRedirectUrl(currentUrl);
      router.replace("/log-in-or-create-account");
      return;
    }

    // 2. 학교 인증 체크
    if (!user.schoolVerified) {
      trackEvent("gate_redirect", {
        reason: "school_verification_required",
        from_path: currentUrl,
        target_path: "/school-verification",
        season_id: seasonId,
      });
      saveRedirectUrl(currentUrl);
      router.replace("/school-verification");
      return;
    }
  }, [authLoading, isLoggedIn, user, router, pathname, seasonId]);

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
