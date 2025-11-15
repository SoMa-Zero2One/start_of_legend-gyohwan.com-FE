"use client";

import { useEffect, useState } from "react";
import { getPostDetail } from "@/lib/api/community";
import Header from "@/components/layout/Header";
import PostActionMenuButton from "@/components/community/PostActionMenuButton";
import PostDetailContent from "@/components/community/PostDetailContent";
import CommentList from "@/components/community/CommentList";
import CommentInputButton from "@/components/community/CommentInputButton";
import type { PostDetailResponse } from "@/types/communityPost";

interface PostDetailPageClientProps {
  postId: number;
}

/**
 * 커뮤니티 게시글 상세 페이지 (클라이언트 사이드 fetch)
 */
export default function PostDetailPageClient({ postId }: PostDetailPageClientProps) {
  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게시글 데이터 fetch 함수 (재사용 가능)
  const fetchPost = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPostDetail(postId);
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시글을 불러올 수 없습니다.");
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 낙관적 업데이트: 댓글 삭제 (즉시 UI에서 제거)
  const handleOptimisticDelete = (commentId: number) => {
    if (!post) return;
    setPost({
      ...post,
      comments: post.comments?.filter((comment) => comment.commentId !== commentId) || [],
    });
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
          <p className="body-1 text-gray-900">게시글을 불러오는 중입니다.</p>
          <p className="caption-2 mt-[8px] text-gray-700">잠시만 기다려 주세요.</p>
        </div>
      );
    }

    if (error || !post) {
      return (
        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
          <p className="body-1 text-gray-900">게시글을 불러올 수 없습니다.</p>
          <p className="caption-2 mt-[8px] text-gray-700">{error ?? "알 수 없는 오류가 발생했습니다."}</p>
        </div>
      );
    }

    return (
      <>
        <PostDetailContent post={post} />
        <div className="mt-[32px]">
          <CommentList
            comments={post.comments || []}
            postId={postId}
            onRefetch={fetchPost}
            onOptimisticDelete={handleOptimisticDelete}
          />
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-20 bg-white">
        <Header showPrevButton showHomeButton showBorder>
          {post && !isLoading ? <PostActionMenuButton post={post} /> : null}
        </Header>
      </div>

      <main className="mx-auto w-full max-w-[430px] flex-1 px-[20px] py-[24px]">
        {renderBody()}
        <div className="h-[80px]" />
      </main>

      <CommentInputButton postId={postId} onRefetch={fetchPost} />
    </div>
  );
}
