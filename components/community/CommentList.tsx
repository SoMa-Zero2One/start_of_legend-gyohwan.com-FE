"use client";

import CommentItem from "./CommentItem";
import type { Comment } from "@/types/communityPost";

interface CommentListProps {
  comments: Comment[];
  postId: number;
  onRefetch: () => Promise<void>;
  onOptimisticDelete: (commentId: number) => void;
}

/**
 * 댓글 목록 컴포넌트
 *
 * USAGE: PostDetailPage에서 댓글 목록 표시
 *
 * WHAT: 댓글 배열을 받아서 CommentItem으로 렌더링
 *
 * WHY:
 * - 댓글이 없으면 안내 메시지 표시
 * - 각 댓글은 구분선으로 분리
 * - CommentItem에 삭제 기능 위임
 * - onRefetch 콜백을 CommentItem으로 전달
 * - onOptimisticDelete로 즉각적인 삭제 UI 제공
 *
 * @param comments 댓글 배열
 * @param postId 게시글 ID (댓글 삭제 후 새로고침용)
 * @param onRefetch 댓글 목록 새로고침 콜백
 * @param onOptimisticDelete 낙관적 삭제 콜백 (즉시 UI에서 제거)
 */
export default function CommentList({ comments, postId, onRefetch, onOptimisticDelete }: CommentListProps) {
  // 댓글이 없는 경우
  if (!comments || comments.length === 0) {
    return (
      <div className="py-[32px] text-center">
        <p className="body-2 text-gray-500">첫 댓글을 남겨보세요!</p>
      </div>
    );
  }

  return (
    <div>
      {/* 댓글 제목 */}
      <h2 className="body-1 mb-[16px] text-gray-900">댓글 {comments.length}개</h2>

      {/* 댓글 목록 */}
      <div className="flex flex-col">
        {comments.map((comment, index) => (
          <div key={comment.commentId}>
            <CommentItem
              comment={comment}
              postId={postId}
              onRefetch={onRefetch}
              onOptimisticDelete={onOptimisticDelete}
            />
            {/* 마지막 댓글이 아니면 구분선 표시 */}
            {index < comments.length - 1 && <div className="my-[12px] h-[1px] bg-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  );
}
