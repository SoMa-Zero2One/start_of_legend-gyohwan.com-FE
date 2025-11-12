"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/common/Toast";
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
          className="flex h-[20px] cursor-pointer items-center justify-center"
          aria-label="메뉴"
        >
          <div className="flex gap-[2px]">
            <div className="h-[3px] w-[3px] rounded-full bg-gray-900" />
            <div className="h-[3px] w-[3px] rounded-full bg-gray-900" />
            <div className="h-[3px] w-[3px] rounded-full bg-gray-900" />
          </div>
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
