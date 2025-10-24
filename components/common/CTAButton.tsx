"use client";

import { useRef } from "react";

interface CTAButtonProps {
  message: string;
  onClick: () => void;
  shouldShake?: boolean;
  tooltipMessage?: string;
  showGradient?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function CTAButton({
  message,
  onClick,
  shouldShake = false,
  tooltipMessage,
  showGradient = true,
  disabled = false,
  isLoading = false,
}: CTAButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-[420px] -translate-x-1/2 bg-white px-[20px] pb-[20px]">
      {/* 그라데이션 (optional) */}
      {showGradient && (
        <div className="pointer-events-none absolute -top-[60px] left-0 h-[60px] w-full bg-gradient-to-t from-white to-transparent" />
      )}

      {/* 툴팁 (tooltipMessage가 있으면 자동으로 표시) */}
      {tooltipMessage && (
        <div className="absolute -top-[50px] left-1/2 z-10 w-full -translate-x-1/2 text-center">
          <div className="caption-2 inline-block rounded-md bg-black px-4 py-2 text-white">{tooltipMessage}</div>
          <div className="absolute -bottom-[5px] left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-t-black border-r-transparent border-l-transparent" />
        </div>
      )}

      <button
        ref={buttonRef}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`btn-primary body-1 w-full rounded-[4px] p-[12px] shadow-[0_0_8px_rgba(0,0,0,0.06)] disabled:opacity-50 ${
          shouldShake ? "animate-shake" : ""
        }`}
      >
        {isLoading ? "처리 중..." : message}
      </button>
    </div>
  );
}
