"use client";

import { useState } from "react";
import HeartIcon from "@/components/icons/HeartIcon";
import CommentIcon from "@/components/icons/CommentIcon";
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
 * - 좋아요 버튼 (isLiked 상태 반영, 클릭 시 색상 변경)
 * - API 미구현: 현재는 로컬 상태만 변경 (실제 API는 추후 구현)
 * - 날짜 포맷: "2025-01-05 12:34" 형식
 * - HeartIcon, CommentIcon 재사용
 *
 * @param post 게시글 상세 정보
 */
export default function PostDetailContent({ post }: PostDetailContentProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);

  // 좋아요 토글 (TODO: API 구현 시 실제 요청 추가)
  const handleLikeToggle = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    // TODO: API 호출 (POST /v1/community/posts/{postId}/like)
  };

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

  return (
    <article>
      {/* 작성자 정보 */}
      <div className="mb-[16px] flex items-center gap-[8px]">
        <span className="body-2 text-gray-900">{post.author?.nickname || "익명"}</span>
        <span className="caption-2 text-gray-500">{formatDate(post.createdAt)}</span>
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
  );
}
