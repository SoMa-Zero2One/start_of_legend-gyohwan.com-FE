"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useModalHistory } from "@/hooks/useModalHistory";
import PostCreateModal from "./PostCreateModal";

const MODAL_KEY = "write";

interface WritePostButtonProps {
  countryCode?: string; // 국가 커뮤니티
  outgoingUnivId?: number; // 대학 커뮤니티
}

/**
 * 글쓰기 버튼 컴포넌트
 *
 * USAGE:
 * - 국가 커뮤니티 페이지: "커뮤니티" 제목 옆
 * - 대학 커뮤니티 페이지: "커뮤니티" 제목 옆
 *
 * WHAT: PostCreateModal을 여는 버튼 (URL 기반 모달)
 *
 * WHY:
 * - useModalHistory로 브라우저 뒤로가기와 동기화
 * - URL에 ?modal=write 파라미터로 모달 상태 관리
 * - useEffect + useRef 패턴으로 모달이 닫힌 후 정확한 타이밍에 새로고침
 *
 * @param countryCode 국가 코드 (국가 커뮤니티)
 * @param outgoingUnivId 대학 ID (대학 커뮤니티)
 */
export default function WritePostButton({ countryCode, outgoingUnivId }: WritePostButtonProps) {
  const searchParams = useSearchParams();
  const { isOpen, openModal, closeModal } = useModalHistory({ modalKey: MODAL_KEY });
  const shouldRefreshRef = useRef(false);
  const modalParam = searchParams.get("modal");

  // 모달이 닫힌 후 (URL에서 ?modal=write 제거됨) 새로고침 실행
  useEffect(() => {
    if (modalParam !== MODAL_KEY && shouldRefreshRef.current) {
      shouldRefreshRef.current = false;

      // 새 글은 항상 1페이지 최상단에 추가되므로
      // 현재 페이지와 관계없이 1페이지로 이동 (page 파라미터 제거)
      const currentPath = window.location.pathname;
      window.location.href = currentPath; // query params 제거하고 리로드
    }
  }, [modalParam]);

  const handleSuccess = () => {
    // 새로고침 플래그 설정
    // closeModal()이 실행되면 modalParam이 변경되고, useEffect가 트리거됨
    shouldRefreshRef.current = true;
    closeModal();
  };

  return (
    <>
      <button onClick={openModal} className="cursor-pointer rounded-full bg-gray-300 px-[12px] py-[6px] text-[12px]">
        글 쓰러 가기
      </button>

      <PostCreateModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
        countryCode={countryCode}
        outgoingUnivId={outgoingUnivId}
      />
    </>
  );
}
