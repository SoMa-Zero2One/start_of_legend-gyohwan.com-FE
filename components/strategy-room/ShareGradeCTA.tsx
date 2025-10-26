"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

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

  // Layout에서 이미 로그인/학교인증을 체크하므로 직접 이동만 함
  const handleClick = () => {
    router.push(`/strategy-room/${seasonId}/applications/new`);
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
        className={`btn-primary w-full rounded-[4px] p-[12px] shadow-[0_0_8px_rgba(0,0,0,0.06)] ${
          shouldShake ? "animate-shake" : ""
        }`}
      >
        성적 공유하고 전체 확인하기 🚀
      </button>
    </div>
  );
}
