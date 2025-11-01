"use client";

import { useEffect, ReactNode } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

/**
 * 공통 모달 컴포넌트
 * 모든 모달의 기본 레이아웃과 동작을 제공합니다.
 * - Escape 키로 닫기
 * - 배경 클릭으로 닫기
 * - 클라이언트 렌더링
 */
export default function BaseModal({ isOpen, onClose, children, maxWidth = "320px" }: BaseModalProps) {
  // Escape 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black px-[20px]"
      onClick={onClose}
    >
      <div
        className="w-full rounded-[12px] bg-white p-[24px]"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
