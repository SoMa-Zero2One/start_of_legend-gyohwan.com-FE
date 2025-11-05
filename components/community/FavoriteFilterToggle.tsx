"use client";

import { useEffect, useState, useRef } from "react";

interface FavoriteFilterToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function FavoriteFilterToggle({ checked, onChange }: FavoriteFilterToggleProps) {
  const [opacity, setOpacity] = useState(1);
  const footerRef = useRef<HTMLElement | null>(null);

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

  if (opacity === 0) return null;

  return (
    <div className="fixed bottom-0 left-1/2 z-[100] flex w-full max-w-[430px] -translate-x-1/2 items-center justify-center bg-transparent px-[20px] pb-[20px]">
      <div
        className="z-10 flex items-center gap-[12px] rounded-full bg-white px-[16px] py-[12px] shadow-[0_8px_25px_rgba(0,0,0,0.3)]"
        style={{ opacity }}
      >
        {/* iOS 스타일 토글 */}
        <button
          onClick={() => onChange(!checked)}
          className={`relative h-[18px] w-[32px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
            checked ? "bg-primary-blue" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15)] transition-transform duration-200 ${
              checked ? "translate-x-[16px]" : "translate-x-[2px]"
            }`}
          />
        </button>
        <span className="medium-body-3">즐겨찾기만 보기</span>
      </div>
    </div>
  );
}
