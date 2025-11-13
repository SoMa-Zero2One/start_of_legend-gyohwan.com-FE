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

              // 현재 경로에서 적절한 목록 페이지로 이동
              const pathname = window.location.pathname;

              if (pathname.includes("/university/")) {
                // 대학 커뮤니티는 항상 /talks로
                // /community/university/1/posts/12 → /community/university/1/talks
                const univId = pathname.split("/university/")[1]?.split("/")[0];
                router.replace(`/community/university/${univId}/talks`);
              } else if (pathname.includes("/country/")) {
                // 국가 커뮤니티도 항상 /talks로
                // /community/country/AE/posts/13 → /community/country/AE/talks
                const countryCode = pathname.split("/country/")[1]?.split("/")[0];
                router.replace(`/community/country/${countryCode}/talks`);
              } else {
                // 커뮤니티 홈으로 (fallback)
                router.replace("/community");
              }
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
