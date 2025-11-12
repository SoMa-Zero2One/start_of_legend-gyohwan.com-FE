"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { createComment } from "@/lib/api/community";
import type { CommentCreateRequest } from "@/types/communityPost";
import RoundCheckbox from "@/components/common/RoundCheckbox";
import EyeOpenIcon from "@/components/icons/EyeOpenIcon";
import EyeClosedIcon from "@/components/icons/EyeClosedIcon";

interface CommentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // 댓글 작성 성공 시 콜백
  postId: number; // 게시글 ID
}

/**
 * 댓글 작성 모달
 *
 * USAGE: CommentInputButton에서 호출
 *
 * WHAT: 전체 화면 모달 형태의 댓글 작성 UI
 *
 * WHY:
 * - 회원/비회원 모두 댓글 작성 가능하도록 분기 처리
 * - 회원: 익명 체크박스로 익명 여부 선택
 * - 비회원: 비밀번호 입력란 제공 (삭제용)
 * - PostCreateModal 패턴 재사용 (애니메이션, 유효성 검증)
 *
 * @param isOpen 모달 표시 여부
 * @param onClose 모달 닫기 콜백
 * @param onSuccess 댓글 작성 성공 시 콜백 (새로고침)
 * @param postId 게시글 ID
 */
export default function CommentCreateModal({ isOpen, onClose, onSuccess, postId }: CommentCreateModalProps) {
  const { isLoggedIn } = useAuthStore();

  // 폼 상태
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false); // 회원 전용
  const [guestPassword, setGuestPassword] = useState(""); // 비회원 전용
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 여부

  // UI 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모달이 닫힐 때 상태 초기화
  const handleClose = () => {
    setContent("");
    setIsAnonymous(false);
    setGuestPassword("");
    setShowPassword(false);
    setError(null);
    onClose();
  };

  // 댓글 작성 제출
  const handleSubmit = async () => {
    setError(null);

    // 유효성 검증
    if (!content.trim()) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }
    if (!isLoggedIn && !guestPassword.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const request: CommentCreateRequest = {
        content: content.trim(),
        isAnonymous: isLoggedIn ? isAnonymous : undefined,
        guestPassword: isLoggedIn ? undefined : guestPassword.trim(),
      };

      await createComment(postId, request);

      // 성공 시
      handleClose();
      onSuccess?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isAnimating, setIsAnimating] = useState(false);

  // 모달 열릴 때 배경 스크롤 방지 및 애니메이션
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 작성하기 버튼 활성화 조건
  const isFormValid = content.trim() !== "" && (isLoggedIn || guestPassword.trim() !== "");

  // 모달 닫기 (애니메이션 포함)
  const handleCloseWithAnimation = () => {
    setIsAnimating(false);
    setTimeout(() => {
      handleClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isAnimating ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleCloseWithAnimation}
      />

      {/* 모달 컨테이너 */}
      <div
        className={`fixed bottom-0 left-1/2 z-50 flex h-full w-full max-w-[430px] -translate-x-1/2 flex-col bg-white transition-transform duration-300 ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-[20px] py-[16px]">
          <button onClick={handleCloseWithAnimation} className="body-2 cursor-pointer text-gray-700">
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
            className="body-2 cursor-pointer text-primary-blue disabled:cursor-not-allowed disabled:text-gray-500"
          >
            {isSubmitting ? "작성 중..." : "작성하기"}
          </button>
        </div>

        {/* 본문 */}
        <div className="flex flex-1 flex-col">
          {/* 에러 메시지 */}
          {error && (
            <div className="mx-[20px] mt-[20px] rounded-[4px] bg-red-50 px-[16px] py-[12px]">
              <p className="body-2 text-error-red">{error}</p>
            </div>
          )}

          {/* 댓글 입력 - flex-1로 남은 공간 모두 차지 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="body-2 flex-1 resize-none px-[20px] py-[20px] outline-none placeholder:text-gray-500"
            maxLength={1000}
            autoFocus
          />

          {/* 하단 고정 영역: 익명 체크박스 / 비밀번호 */}
          <div className="border-t border-gray-200 px-[20px] py-[16px]">
            {/* 회원: 익명 체크박스 */}
            {isLoggedIn && <RoundCheckbox checked={isAnonymous} onChange={setIsAnonymous} label="익명으로 올리기" />}

            {/* 비회원: 비밀번호 입력 */}
            {!isLoggedIn && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={guestPassword}
                  onChange={(e) => setGuestPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="body-2 w-full border-b border-gray-300 pb-[8px] pr-[40px] outline-none placeholder:text-gray-500 focus:border-gray-700"
                  maxLength={50}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 cursor-pointer text-gray-500"
                >
                  {showPassword ? <EyeOpenIcon size={20} /> : <EyeClosedIcon size={20} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
