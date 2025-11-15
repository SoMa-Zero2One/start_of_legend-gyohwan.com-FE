"use client";

import { useModalHistory } from "@/hooks/useModalHistory";
import CommentCreateModal from "./CommentCreateModal";

const MODAL_KEY = "comment";

interface CommentInputButtonProps {
  postId: number;
  onRefetch: () => Promise<void>;
}

/**
 * 댓글 입력 버튼 (하단 고정)
 *
 * USAGE: 게시글 상세 페이지 하단에 고정
 *
 * WHAT: "댓글을 남겨보세요" 버튼 + CommentCreateModal
 *
 * WHY:
 * - ShareGradeCTA 패턴 차용 (그라데이션 + 하단 고정)
 * - useModalHistory로 브라우저 뒤로가기와 동기화
 * - URL 파라미터 (?modal=comment)로 모달 상태 관리
 * - onRefetch로 클라이언트 상태 업데이트 (깜빡임 없음)
 *
 * @param postId 게시글 ID (댓글 작성 API 호출용)
 * @param onRefetch 댓글 목록 새로고침 콜백
 */
export default function CommentInputButton({ postId, onRefetch }: CommentInputButtonProps) {
  const { isOpen, openModal, closeModal } = useModalHistory({ modalKey: MODAL_KEY });

  const handleSuccess = () => {
    closeModal(); // 모달 닫기 (URL에서 ?modal=comment 제거)
    onRefetch(); // 댓글 목록 새로고침
  };

  return (
    <>
      {/* 하단 고정 입력 버튼 (ShareGradeCTA 패턴) */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[420px] -translate-x-1/2 bg-white px-[20px] pb-[20px]">
        {/* 그라데이션 */}
        <div className="pointer-events-none absolute -top-[60px] left-0 h-[60px] w-full bg-gradient-to-t from-white to-transparent" />

        <button
          onClick={openModal}
          className="body-2 w-full cursor-pointer rounded-[8px] border border-gray-300 bg-gray-100 px-[16px] py-[12px] text-left text-gray-500 shadow-[0_0_8px_rgba(0,0,0,0.06)] hover:bg-gray-300"
        >
          댓글을 남겨보세요
        </button>
      </div>

      {/* 댓글 작성 모달 */}
      <CommentCreateModal isOpen={isOpen} onClose={closeModal} onSuccess={handleSuccess} postId={postId} />
    </>
  );
}
