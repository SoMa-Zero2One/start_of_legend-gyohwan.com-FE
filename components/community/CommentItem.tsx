"use client";

import { useState } from "react";
import { deleteComment } from "@/lib/api/community";
import { formatDateTime } from "@/lib/utils/date";
import { useModalHistory } from "@/hooks/useModalHistory";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/common/Toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import PasswordConfirmModal from "./PasswordConfirmModal";
import type { Comment } from "@/types/communityPost";

interface CommentItemProps {
  comment: Comment;
  postId: number;
  onRefetch: () => Promise<void>;
  onOptimisticDelete: (commentId: number) => void;
}

/**
 * 개별 댓글 컴포넌트
 *
 * USAGE: CommentList에서 렌더링
 *
 * WHAT: 댓글 작성자, 시간, 내용, 삭제 버튼
 *
 * WHY:
 * - 회원 본인 댓글(isAuthor=true): 삭제 버튼 표시
 * - 비회원 댓글(isMember=false): 삭제 버튼 표시 (비밀번호 확인)
 * - 다른 사람 댓글: 삭제 버튼 숨김
 * - 낙관적 업데이트로 즉시 UI에서 제거 (빠른 피드백)
 * - 삭제 후 onRefetch로 서버 데이터와 동기화 (정확성 보장)
 * - useToast로 피드백 메시지 표시 (alert 대신)
 *
 * @param comment 댓글 정보
 * @param postId 게시글 ID (새로고침용)
 * @param onRefetch 댓글 목록 새로고침 콜백
 * @param onOptimisticDelete 낙관적 삭제 콜백 (즉시 UI에서 제거)
 */
export default function CommentItem({ comment, onRefetch, onOptimisticDelete }: CommentItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteConfirmModal = useModalHistory({ modalKey: `comment-delete-${comment.commentId}` });
  const passwordModal = useModalHistory({ modalKey: `comment-password-${comment.commentId}` });
  const { errorMessage, isExiting, showError, hideToast } = useToast();

  const isAuthor = comment.author?.isAuthor === true;
  const isMemberComment = comment.author?.isMember === true;

  // 삭제 가능 여부: 본인 댓글이거나 비회원 댓글
  const canDelete = isAuthor || !isMemberComment;

  // 삭제 버튼 클릭 (회원 본인 댓글)
  const handleDeleteClick = () => {
    if (!isAuthor) return;
    deleteConfirmModal.openModal();
  };

  // 삭제 확인 (회원 본인 댓글)
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    deleteConfirmModal.closeModal();

    // 1. 낙관적 업데이트: 즉시 UI에서 제거
    onOptimisticDelete(comment.commentId);

    try {
      // 2. API 호출
      await deleteComment(comment.commentId);
      showError("댓글이 삭제되었습니다.");
      // 3. 서버 데이터와 동기화
      await onRefetch();
    } catch (error) {
      // 4. 실패 시 refetch로 원복
      await onRefetch();
      showError(error instanceof Error ? error.message : "삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 삭제 (비회원 댓글 - 비밀번호 확인)
  const handleDeleteGuest = () => {
    passwordModal.openModal();
  };

  // 비밀번호 확인 후 삭제
  const handlePasswordConfirm = async (password: string) => {
    setIsDeleting(true);

    // 1. 낙관적 업데이트: 즉시 UI에서 제거
    onOptimisticDelete(comment.commentId);

    try {
      // 2. API 호출
      await deleteComment(comment.commentId, password);
      passwordModal.closeModal();
      showError("댓글이 삭제되었습니다.");
      // 3. 서버 데이터와 동기화
      await onRefetch();
    } catch (error) {
      // 4. 실패 시 refetch로 원복
      await onRefetch();
      // 에러는 PasswordConfirmModal에서 표시하도록 throw
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between gap-[12px] py-[8px]">
        {/* 댓글 내용 */}
        <div className="flex-1">
          {/* 작성자 & 시간 */}
          <div className="mb-[4px] flex items-center gap-[8px]">
            <span className="caption-1 text-gray-900">{comment.author?.nickname || "익명"}</span>
            <span className="caption-2 text-gray-500">{formatDateTime(comment.createdAt)}</span>
          </div>

          {/* 댓글 본문 */}
          <p className="body-2 whitespace-pre-wrap text-gray-900">{comment.content || ""}</p>
        </div>

        {/* 삭제 버튼 (본인 댓글 or 비회원 댓글) */}
        {canDelete && (
          <button
            onClick={isAuthor ? handleDeleteClick : handleDeleteGuest}
            disabled={isDeleting}
            className="caption-2 cursor-pointer text-gray-500 hover:text-error-red disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </button>
        )}
      </div>

      {/* Toast 메시지 */}
      <Toast message={errorMessage} isExiting={isExiting} onClose={hideToast} />

      {/* 삭제 확인 모달 (회원 본인 댓글) */}
      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        title="댓글 삭제"
        message="댓글을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={deleteConfirmModal.closeModal}
      />

      {/* 비밀번호 확인 모달 (비회원 댓글 삭제 시) */}
      <PasswordConfirmModal
        isOpen={passwordModal.isOpen}
        onConfirm={handlePasswordConfirm}
        onClose={passwordModal.closeModal}
        title="댓글 삭제"
        description="댓글 작성 시 입력한 비밀번호를 입력해주세요."
      />
    </>
  );
}
