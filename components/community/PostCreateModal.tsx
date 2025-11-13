"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { createPost } from "@/lib/api/community";
import type { PostCreateRequest } from "@/types/community";
import RoundCheckbox from "@/components/common/RoundCheckbox";
import EyeOpenIcon from "@/components/icons/EyeOpenIcon";
import EyeClosedIcon from "@/components/icons/EyeClosedIcon";

interface PostCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // 글 작성 성공 시 콜백
  countryCode?: string; // 국가 커뮤니티일 때
  outgoingUnivId?: number; // 대학 커뮤니티일 때
}

/**
 * 커뮤니티 게시글 작성 모달
 *
 * USAGE:
 * - 국가 커뮤니티 페이지 (community/country/[countryCode]/talk)
 * - 대학 커뮤니티 페이지 (community/universities/[univId]/talk)
 *
 * WHAT: 전체 화면 모달 형태의 게시글 작성 UI
 *
 * WHY:
 * - 회원/비회원 모두 글 작성 가능하도록 분기 처리
 * - 회원: 익명 체크박스로 익명 여부 선택
 * - 비회원: 비밀번호 입력란 제공 (수정/삭제용)
 * - 모달 방식으로 컨텍스트 유지 및 빠른 작성/취소 가능
 *
 * @param isOpen 모달 표시 여부
 * @param onClose 모달 닫기 콜백
 * @param onSuccess 글 작성 성공 시 콜백 (목록 새로고침 등)
 * @param countryCode 국가 코드 (국가 커뮤니티)
 * @param outgoingUnivId 대학 ID (대학 커뮤니티)
 */
export default function PostCreateModal({
  isOpen,
  onClose,
  onSuccess,
  countryCode,
  outgoingUnivId,
}: PostCreateModalProps) {
  const { isLoggedIn } = useAuthStore();

  // 폼 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false); // 회원 전용
  const [guestPassword, setGuestPassword] = useState(""); // 비회원 전용
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 여부

  // UI 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모달이 닫힐 때 상태 초기화
  const handleClose = () => {
    setTitle("");
    setContent("");
    setIsAnonymous(false);
    setGuestPassword("");
    setShowPassword(false);
    setError(null);
    onClose();
  };

  // 글 작성 제출
  const handleSubmit = async () => {
    setError(null);

    // 유효성 검증
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }
    if (!isLoggedIn && !guestPassword.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const request: PostCreateRequest = {
        title: title.trim(),
        content: content.trim(),
        isAnonymous: isLoggedIn ? isAnonymous : false,
        guestPassword: isLoggedIn ? null : guestPassword.trim(),
        countryCode,
        outgoingUnivId,
      };

      await createPost(request);

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
  const isFormValid = title.trim() !== "" && content.trim() !== "" && (isLoggedIn || guestPassword.trim() !== "");

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
          <button onClick={handleCloseWithAnimation} className="body-2 cursor-pointer text-gray-600">
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
            className="body-2 text-primary-blue cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400"
          >
            {isSubmitting ? "작성 중..." : "작성하기"}
          </button>
        </div>

        {/* 본문 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col overflow-y-auto px-[20px] py-[20px]">
            {/* 에러 메시지 */}
            {error && (
              <div className="mb-[16px] rounded-[4px] bg-red-50 px-[16px] py-[12px]">
                <p className="body-2 text-red-600">{error}</p>
              </div>
            )}

            {/* 제목 입력 */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="body-1 mb-[16px] w-full border-b border-gray-200 pb-[12px] outline-none placeholder:text-gray-400"
              maxLength={100}
            />

            {/* 본문 입력 */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              className="body-2 w-full flex-1 resize-none outline-none placeholder:text-gray-400"
              maxLength={65535}
            />
          </div>

          {/* 하단 고정 영역: 익명 체크박스 / 비밀번호 */}
          <div className="flex-shrink-0 border-t border-gray-200 px-[20px] py-[16px]">
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
                  className="body-2 w-full border-b border-gray-300 pr-[40px] pb-[8px] outline-none placeholder:text-gray-400 focus:border-gray-600"
                  maxLength={50}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-0 right-0 cursor-pointer text-gray-400"
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
