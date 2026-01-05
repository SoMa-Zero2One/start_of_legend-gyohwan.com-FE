"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { trackEvent } from "@/lib/analytics/gtag";
import { useEligibilityGuard } from "@/hooks/useEligibilityGuard";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/common/Toast";

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
  const { guardEligibility } = useEligibilityGuard();
  const { message, messageType, isExiting, showMessage, hideToast } = useToast();
  const [opacity, setOpacity] = useState(1);
  const footerRef = useRef<HTMLElement | null>(null);
  const ctaParams = {
    cta_id: "grade_share_cta_bottom_bar",
    cta_location: "grade_share_page",
    cta_label: "성적 공유하고 전체 확인하기 🚀",
    season_id: seasonId,
    entry_point: "strategy_room_bottom_bar",
  };

  useEffect(() => {
    // Footer 요소 찾기
    const footer = document.querySelector("footer");
    footerRef.current = footer;

    if (!footer) return;

    // Intersection Observer 설정
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Footer가 보이는 비율에 따라 opacity 조절
          // intersectionRatio: 0 (안 보임) ~ 1 (완전히 보임)
          // opacity: 1 (완전 표시) ~ 0 (완전 숨김)
          const newOpacity = Math.max(0, 1 - entry.intersectionRatio * 2);
          setOpacity(newOpacity);
        });
      },
      {
        threshold: Array.from({ length: 51 }, (_, i) => i * 0.02), // 0, 0.02, 0.04, ..., 1.0
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 로그인/학교인증은 Layout에서 체크하고, 여기서는 eligibility만 사전 확인
  const handleClick = () => {
    trackEvent("cta_click", ctaParams);
    void guardEligibility(Number(seasonId), () => {
      router.push(`/strategy-room/${seasonId}/applications/new`);
    }, {
      onFail: (message) => showMessage(message, "error"),
    });
  };

  if (opacity === 0) return null;

  return (
    <div
      className="medium-body-2 fixed bottom-0 left-1/2 flex w-full max-w-[420px] -translate-x-1/2 justify-center bg-white px-[20px] pb-[20px] xl:pb-[40px] 2xl:pb-[60px]"
      style={{ opacity }}
    >
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
        onClick={handleClick}
        className={`btn-primary w-full cursor-pointer rounded-[4px] p-[12px] shadow-[0_0_8px_rgba(0,0,0,0.06)] xl:w-[420px] xl:rounded-[12px] xl:py-[16px] ${
          shouldShake ? "animate-shake" : ""
        }`}
      >
        성적 공유하고 전체 확인하기 🚀
      </button>

      <Toast message={message} type={messageType} isExiting={isExiting} onClose={hideToast} />
    </div>
  );
}
