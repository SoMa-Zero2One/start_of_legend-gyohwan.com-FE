"use client";

import { useState } from "react";
import { deletePost } from "@/lib/api/community";
import { useModalHistory } from "@/hooks/useModalHistory";
import ConfirmModal from "@/components/common/ConfirmModal";
import PasswordConfirmModal from "./PasswordConfirmModal";
import type { PostDetailResponse } from "@/types/communityPost";

interface PostActionMenuProps {
  post: PostDetailResponse;
  onClose: () => void;
  onDelete: () => void;
  showToast: (message: string, duration?: number) => void;
}

/**
 * 게시글 액션 드롭다운 메뉴
 *
 * USAGE: PostActionMenuButton에서 표시
 *
 * WHAT: 수정/삭제/공유 메뉴 표시
 *
 * WHY:
 * - 회원 본인 글(isAuthor=true): 수정/삭제 활성화
 * - 비회원 글(isMember=false): 삭제만 활성화 (비밀번호 확인)
 * - 다른 사람 글: 수정/삭제 blur 처리 (클릭 불가)
 * - 공유: 항상 활성화 (URL 복사)
 * - showToast는 부모(PostActionMenuButton)에서 전달받아 사용
 * - useModalHistory로 비밀번호 모달 관리
 *
 * ALTERNATIVES:
 * - Bottom Sheet 방식: 화면 하단에서 올라오는 모달 (모바일 앱 패턴)
 * - 드롭다운 방식 선택: 스크린샷에서 우측 상단 드롭다운 확인
 */
export default function PostActionMenu({ post, onClose, onDelete, showToast }: PostActionMenuProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteConfirmModal = useModalHistory({ modalKey: "post-delete" });
  const passwordModal = useModalHistory({ modalKey: "password" });

  const isAuthor = post.author?.isAuthor === true;
  const isMemberPost = post.author?.isMember === true;

  // 삭제 가능 여부: 본인 글이거나 비회원 글
  const canDelete = isAuthor || !isMemberPost;

  // 수정 가능 여부: 본인 글만 가능 (TODO: 수정 기능 구현 예정)
  const canEdit = isAuthor;

  // 공유하기 (URL 복사)
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("링크가 복사되었습니다!");
      onClose();
    } catch (error) {
      showToast("링크 복사에 실패했습니다.");
    }
  };

  // 삭제 버튼 클릭 (회원 본인 글)
  const handleDeleteClick = () => {
    if (!isAuthor) return;
    deleteConfirmModal.openModal();
  };

  // 삭제 확인 (회원 본인 글)
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    deleteConfirmModal.closeModal();
    try {
      await deletePost(post.postId);
      showToast("게시글이 삭제되었습니다.");
      setTimeout(() => {
        onDelete();
      }, 300);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 삭제 (비회원 글 - 비밀번호 확인)
  const handleDeleteGuest = () => {
    passwordModal.openModal();
  };

  // 비밀번호 확인 후 삭제
  const handlePasswordConfirm = async (password: string) => {
    setIsDeleting(true);
    try {
      await deletePost(post.postId, password);
      passwordModal.closeModal();
      showToast("게시글이 삭제되었습니다.");
      setTimeout(() => {
        onDelete();
      }, 300);
    } catch (error) {
      // 에러는 PasswordConfirmModal에서 표시하도록 throw
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  // 수정 (TODO: 구현 예정)
  const handleEdit = () => {
    if (!canEdit) return;
    // TODO: 게시글 수정 모달 열기
    showToast("수정 기능은 추후 구현 예정입니다.");
    onClose();
  };

  return (
    <>
      {/* 배경 클릭 시 닫기 */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* 드롭다운 메뉴 */}
      <div className="absolute top-[28px] right-0 z-50 w-[140px] rounded-[8px] border border-gray-300 bg-white shadow-lg">
        {/* 수정 버튼 (본인 글만 활성화, TODO) */}
        <button
          onClick={handleEdit}
          disabled={!canEdit}
          className={`body-2 w-full cursor-pointer border-b border-gray-300 px-[16px] py-[12px] text-left hover:bg-gray-100 ${
            !canEdit ? "cursor-not-allowed text-gray-500 blur-[0.5px]" : "text-gray-900"
          }`}
        >
          수정하기
        </button>

        {/* 삭제 버튼 */}
        <button
          onClick={isAuthor ? handleDeleteClick : handleDeleteGuest}
          disabled={!canDelete || isDeleting}
          className={`body-2 w-full cursor-pointer border-b border-gray-300 px-[16px] py-[12px] text-left hover:bg-gray-100 ${
            !canDelete || isDeleting ? "cursor-not-allowed text-gray-500 blur-[0.5px]" : "text-error-red"
          }`}
        >
          {isDeleting ? "삭제 중..." : "삭제하기"}
        </button>

        {/* 공유하기 버튼 (항상 활성화) */}
        <button
          onClick={handleShare}
          className="body-2 w-full cursor-pointer px-[16px] py-[12px] text-left text-gray-900 hover:bg-gray-100"
        >
          공유하기
        </button>
      </div>

      {/* 삭제 확인 모달 (회원 본인 글) */}
      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        title="게시글 삭제"
        message="게시글을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={deleteConfirmModal.closeModal}
      />

      {/* 비밀번호 확인 모달 (비회원 삭제 시) */}
      <PasswordConfirmModal
        isOpen={passwordModal.isOpen}
        onConfirm={handlePasswordConfirm}
        onClose={passwordModal.closeModal}
        title="게시글 삭제"
        description="게시글 작성 시 입력한 비밀번호를 입력해주세요."
      />
    </>
  );
}
