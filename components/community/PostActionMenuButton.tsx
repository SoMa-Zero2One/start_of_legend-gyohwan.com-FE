"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/common/Toast";
import MoreIcon from "@/components/icons/MoreIcon";
import PostActionMenu from "./PostActionMenu";
import type { PostDetailResponse } from "@/types/communityPost";

interface PostActionMenuButtonProps {
  post: PostDetailResponse;
}

/**
 * 게시글 액션 메뉴 버튼
 *
 * USAGE: Header의 children으로 전달 (우측에 표시)
 *
 * WHAT: 더보기 버튼 (...) + 드롭다운 메뉴 + Toast
 *
 * WHY:
 * - 게시글 수정/삭제/공유 기능 접근
 * - useState로 메뉴 표시/숨김 관리
 * - useToast를 여기서 관리하여 메뉴가 닫혀도 Toast 유지
 * - 기존 Header 패턴 활용 (children prop)
 */
export default function PostActionMenuButton({ post }: PostActionMenuButtonProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const { errorMessage, isExiting, showError, hideToast } = useToast();

  return (
    <>
      <div className="relative">
        {/* 더보기 버튼 */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex h-[20px] cursor-pointer items-center justify-center text-gray-900"
          aria-label="메뉴"
        >
          <MoreIcon size={20} />
        </button>

        {/* 드롭다운 메뉴 */}
        {showMenu && (
          <PostActionMenu
            post={post}
            onClose={() => setShowMenu(false)}
            onDelete={() => {
              setShowMenu(false);
              router.back(); // 삭제 후 목록으로 복귀
            }}
            showToast={showError}
          />
        )}
      </div>

      {/* Toast 메시지 (메뉴와 독립적으로 표시) */}
      <Toast message={errorMessage} isExiting={isExiting} onClose={hideToast} />
    </>
  );
}
