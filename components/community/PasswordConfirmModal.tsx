"use client";

import { useState } from "react";
import BaseModal from "@/components/common/BaseModal";

interface PasswordConfirmModalProps {
  isOpen: boolean;
  onConfirm: (password: string) => Promise<void>;
  onClose: () => void;
  title: string;
  description: string;
}

/**
 * 비밀번호 확인 모달
 *
 * USAGE: 비회원 게시글/댓글 삭제 시 비밀번호 확인
 *
 * WHAT: 비밀번호 입력 + 확인/취소 버튼
 *
 * WHY:
 * - BaseModal 패턴 재사용
 * - 비회원 삭제 권한 확인
 * - ConfirmModal 패턴 참고
 *
 * @param isOpen 모달 열림 상태
 * @param onConfirm 비밀번호 확인 콜백 (async - API 호출)
 * @param onClose 모달 닫기 콜백
 * @param title 모달 제목 (예: "게시글 삭제", "댓글 삭제")
 * @param description 안내 메시지
 */
export default function PasswordConfirmModal({
  isOpen,
  onConfirm,
  onClose,
  title,
  description,
}: PasswordConfirmModalProps) {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onConfirm(password);
      // 성공 시 모달 닫힘 (부모에서 처리)
      setPassword("");
    } catch (err) {
      // 실패 시 에러 표시
      setError(err instanceof Error ? err.message : "비밀번호가 일치하지 않습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // 제출 중에는 닫기 방지
    setPassword("");
    setError("");
    onClose();
  };

  // Enter 키로 확인
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitting) {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose}>
      {/* 제목 */}
      <h3 className="subhead-2 mb-[12px]">{title}</h3>

      {/* 안내 메시지 */}
      <p className="body-2 mb-[16px] text-gray-700">{description}</p>

      {/* 비밀번호 입력 */}
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError(""); // 입력 시 에러 초기화
        }}
        onKeyDown={handleKeyDown}
        placeholder="비밀번호 입력"
        className="body-2 mb-[8px] w-full rounded-[8px] border border-gray-300 px-[16px] py-[12px] focus:border-primary-blue focus:outline-none"
        disabled={isSubmitting}
        autoFocus
      />

      {/* 에러 메시지 */}
      {error && <p className="caption-2 mb-[16px] text-error-red">{error}</p>}

      {/* 버튼들 */}
      <div className="flex gap-[12px]">
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="medium-body-2 flex-1 cursor-pointer rounded-[8px] border border-gray-300 py-[12px] text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          취소
        </button>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="btn-primary medium-body-2 flex-1 cursor-pointer rounded-[8px] py-[12px] disabled:cursor-not-allowed"
        >
          {isSubmitting ? "확인 중..." : "확인"}
        </button>
      </div>
    </BaseModal>
  );
}
