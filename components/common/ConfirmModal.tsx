"use client";

import { useState, useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트에서만 렌더링
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black px-[20px]">
      <div className="w-full max-w-[320px] rounded-[12px] bg-white p-[24px]">
        {/* 제목 */}
        <h3 className="subhead-2 mb-[12px]">{title}</h3>

        {/* 메시지 */}
        <p className="body-2 mb-[24px] whitespace-pre-line text-gray-700">{message}</p>

        {/* 버튼들 */}
        <div className="flex gap-[12px]">
          <button
            onClick={onCancel}
            className="medium-body-2 flex-1 rounded-[8px] border border-gray-300 py-[12px] text-gray-700 transition-colors hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button onClick={onConfirm} className="btn-primary medium-body-2 flex-1 rounded-[8px] py-[12px]">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
