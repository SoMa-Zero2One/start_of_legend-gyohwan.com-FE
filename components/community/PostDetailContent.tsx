"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/utils/date";
import { likePost, unlikePost } from "@/lib/api/communityPosts";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/useToast";
import HeartIcon from "@/components/icons/HeartIcon";
import CommentIcon from "@/components/icons/CommentIcon";
import Toast from "@/components/common/Toast";
import type { PostDetailResponse } from "@/types/communityPost";

interface PostDetailContentProps {
  post: PostDetailResponse;
}

/**
 * 게시글 상세 내용 컴포넌트
 *
 * USAGE: PostDetailPage의 본문 영역
 *
 * WHAT: 작성자, 시간, 제목, 본문, 좋아요/댓글 수 표시
 *
 * WHY:
 * - 게시글 메타 정보 표시 (작성자 닉네임, 작성 시간)
 * - 좋아요 버튼 (isLiked 상태 반영, 클릭 시 API 호출)
 * - authStore로 로그인 여부 체크 (비로그인 시 안내 메시지)
 * - likePost / unlikePost API로 서버에 좋아요 상태 저장
 * - 낙관적 업데이트: UI 먼저 변경 후 API 호출, 실패 시 롤백
 * - useToast로 에러 처리
 * - 날짜 포맷: "2025-01-05 12:34" 형식
 * - HeartIcon, CommentIcon 재사용
 *
 * @param post 게시글 상세 정보
 */
export default function PostDetailContent({ post }: PostDetailContentProps) {
  const { isLoggedIn } = useAuthStore();
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const { errorMessage, isExiting, showError, hideToast } = useToast();

  // 좋아요 토글 (API 연동)
  const handleLikeToggle = async () => {
    // 로그인 여부 체크
    if (!isLoggedIn) {
      showError("로그인 후 사용 가능합니다.");
      return;
    }

    if (isLikeLoading) return; // 중복 클릭 방지

    // 낙관적 업데이트 (UI 먼저 변경)
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    try {
      setIsLikeLoading(true);

      if (isLiked) {
        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
        await unlikePost(post.postId);
      } else {
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        await likePost(post.postId);
      }
    } catch (error) {
      // 에러 발생 시 이전 상태로 롤백
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      showError("좋아요 처리에 실패했습니다.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  return (
    <>
      <article>
        {/* 작성자 정보 */}
        <div className="mb-[16px] flex items-center gap-[8px]">
          <span className="body-2 text-gray-900">{post.author?.nickname || "익명"}</span>
          <span className="caption-2 text-gray-500">{formatDateTime(post.createdAt)}</span>
        </div>

        {/* 제목 */}
        <h1 className="subhead-1 mb-[12px] text-gray-900">{post.title || "제목 없음"}</h1>

        {/* 본문 */}
        <p className="body-2 mb-[20px] whitespace-pre-wrap text-gray-900">{post.content || ""}</p>

        {/* 좋아요 & 댓글 수 */}
        <div className="flex items-center gap-[16px]">
          {/* 좋아요 버튼 */}
          <button
            onClick={handleLikeToggle}
            className="flex cursor-pointer items-center gap-[4px]"
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            disabled={isLikeLoading}
          >
            <HeartIcon size={18} filled={isLiked} />
            <span className="caption-1 text-gray-700">{likeCount}</span>
          </button>

          {/* 댓글 수 (클릭 불가, 표시만) */}
          <div className="flex items-center gap-[4px]">
            <CommentIcon size={18} />
            <span className="caption-1 text-gray-700">{post.comments?.length ?? 0}</span>
          </div>
        </div>
      </article>

      {/* Toast 메시지 */}
      <Toast message={errorMessage} isExiting={isExiting} onClose={hideToast} />
    </>
  );
}
