import Link from "next/link";
import HeartIcon from "@/components/icons/HeartIcon";
import CommentIcon from "@/components/icons/CommentIcon";
import type { CommunityPost } from "@/types/communityPost";

interface CommunityPostItemProps {
  post: CommunityPost;
  isLast?: boolean;
  countryCode?: string; // 국가 커뮤니티일 때
  outgoingUnivId?: number; // 대학 커뮤니티일 때
}

export default function CommunityPostItem({
  post,
  isLast = false,
  countryCode,
  outgoingUnivId,
}: CommunityPostItemProps) {
  // URL 경로 결정
  const href = countryCode
    ? `/community/country/${countryCode}/posts/${post.postId}`
    : outgoingUnivId
      ? `/community/university/${outgoingUnivId}/posts/${post.postId}`
      : "#"; // fallback: 클릭 불가능

  return (
    <Link
      href={href}
      className={`flex w-full cursor-pointer flex-col gap-[12px] px-[20px] py-[20px] text-left transition-colors hover:bg-gray-50 ${
        isLast ? "" : "border-b border-gray-100"
      }`}
    >
      {/* 제목 */}
      <h3 className="medium-body-3 line-clamp-1 text-black">{post.title}</h3>

      {/* 내용 미리보기 */}
      <p className="body-3 line-clamp-2 text-gray-900">{post.content}</p>

      {/* 하단: 좋아요 + 댓글 */}
      <div className="flex items-center gap-[12px] text-[14px] text-gray-500">
        <div className="flex items-center gap-[4px]">
          <HeartIcon size={18} filled={post.isLiked} />
          <span>{post.likeCount > 999 ? "999+" : post.likeCount}</span>
        </div>
        <div className="flex items-center gap-[4px]">
          <CommentIcon size={18} />
          <span>{post.commentsCount > 999 ? "999+" : post.commentsCount}</span>
        </div>
      </div>
    </Link>
  );
}
