"use client";

import { useRouter } from "next/navigation";
import { useModalHistory } from "@/hooks/useModalHistory";
import PostCreateModal from "./PostCreateModal";

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
 *
 * @param countryCode 국가 코드 (국가 커뮤니티)
 * @param outgoingUnivId 대학 ID (대학 커뮤니티)
 */
export default function WritePostButton({ countryCode, outgoingUnivId }: WritePostButtonProps) {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModalHistory({ modalKey: "write" });

  const handleSuccess = () => {
    // 모달 닫기
    closeModal();

    // 서버 컴포넌트 데이터 새로고침 (부드러운 UX)
    router.refresh();
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
