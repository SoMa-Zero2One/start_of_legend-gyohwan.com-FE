"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteComment } from "@/lib/api/community";
import { useModalHistory } from "@/hooks/useModalHistory";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/common/Toast";
import PasswordConfirmModal from "./PasswordConfirmModal";
import type { Comment } from "@/types/communityPost";

interface CommentItemProps {
  comment: Comment;
  postId: number;
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
 * - 삭제 후 페이지 새로고침으로 댓글 목록 업데이트
 * - useToast로 피드백 메시지 표시 (alert 대신)
 *
 * @param comment 댓글 정보
 * @param postId 게시글 ID (새로고침용)
 */
export default function CommentItem({ comment, postId }: CommentItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const passwordModal = useModalHistory({ modalKey: "comment-password" });
  const { errorMessage, isExiting, showError, hideToast } = useToast();

  const isAuthor = comment.author?.isAuthor === true;
  const isMemberComment = comment.author?.isMember === true;

  // 삭제 가능 여부: 본인 댓글이거나 비회원 댓글
  const canDelete = isAuthor || !isMemberComment;

  // 날짜 포맷: "2025-01-05T12:34:56.000000" → "2025-01-05 12:34"
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  // 삭제 (회원 본인 댓글)
  const handleDelete = async () => {
    if (!isAuthor) return;

    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      await deleteComment(comment.commentId);
      showError("댓글이 삭제되었습니다.");
      setTimeout(() => {
        router.refresh(); // 페이지 새로고침으로 댓글 목록 업데이트
      }, 300);
    } catch (error) {
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
    try {
      await deleteComment(comment.commentId, password);
      showError("댓글이 삭제되었습니다.");
      passwordModal.closeModal();
      setTimeout(() => {
        router.refresh(); // 페이지 새로고침
      }, 300);
    } catch (error) {
      showError(error instanceof Error ? error.message : "삭제에 실패했습니다.");
      throw error; // PasswordConfirmModal에서 에러 처리
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
            <span className="caption-2 text-gray-500">{formatDate(comment.createdAt)}</span>
          </div>

          {/* 댓글 본문 */}
          <p className="body-2 whitespace-pre-wrap text-gray-900">{comment.content || ""}</p>
        </div>

        {/* 삭제 버튼 (본인 댓글 or 비회원 댓글) */}
        {canDelete && (
          <button
            onClick={isAuthor ? handleDelete : handleDeleteGuest}
            disabled={isDeleting}
            className="caption-2 cursor-pointer text-gray-500 hover:text-error-red disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </button>
        )}
      </div>

      {/* Toast 메시지 */}
      <Toast message={errorMessage} isExiting={isExiting} onClose={hideToast} />

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
