"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { saveRedirectUrl } from "@/lib/utils/redirect";

interface ShareGradeCTAProps {
  seasonId: string;
  showTooltip?: boolean;
  shouldShake?: boolean;
  tooltipMessage?: string;
}

export default function ShareGradeCTA({
  seasonId,
  showTooltip = false,
  shouldShake = false,
  tooltipMessage,
}: ShareGradeCTAProps) {
  const router = useRouter();
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const { user, isLoggedIn } = useAuthStore();

  const handleClick = () => {
    const targetUrl = `/strategy-room/${seasonId}/applications/new`;

    // 로그인 확인
    if (!isLoggedIn || !user) {
      // 리다이렉트 URL 저장 후 로그인 페이지로 이동
      saveRedirectUrl(targetUrl);
      router.push("/log-in-or-create-account");
      return;
    }

    // 학교 인증 확인
    if (!user.schoolVerified) {
      // 리다이렉트 URL 저장 후 학교 인증 페이지로 이동
      saveRedirectUrl(targetUrl);
      router.push("/school-verification");
      return;
    }

    // 모두 완료된 경우 바로 이동
    router.push(targetUrl);
  };

  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-[420px] -translate-x-1/2 bg-white px-[20px] pb-[20px]">
      {/* 그라데이션 */}
      <div className="pointer-events-none absolute -top-[60px] left-0 h-[60px] w-full bg-gradient-to-t from-white to-transparent" />

      {/* 툴팁 (optional) */}
      {showTooltip && tooltipMessage && (
        <div className="absolute -top-[50px] left-1/2 z-10 w-full -translate-x-1/2 text-center">
          <div className="caption-2 inline-block rounded-md bg-black px-4 py-2 text-white">{tooltipMessage}</div>
          <div className="absolute -bottom-[5px] left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-t-black border-r-transparent border-l-transparent" />
        </div>
      )}

      <button
        ref={ctaButtonRef}
        onClick={handleClick}
        className={`bg-primary-blue medium-body-2 w-full rounded-[8px] py-[16px] text-white shadow-[0_0_8px_rgba(0,0,0,0.06)] ${
          shouldShake ? "animate-shake" : ""
        }`}
      >
        성적 공유하고 전체 확인하기 🚀
      </button>
    </div>
  );
}
