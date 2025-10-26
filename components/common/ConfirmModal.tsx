"use client";

import BaseModal from "./BaseModal";

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
  return (
    <BaseModal isOpen={isOpen} onClose={onCancel}>
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
    </BaseModal>
  );
}
