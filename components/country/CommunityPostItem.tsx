import HeartIcon from "@/components/icons/HeartIcon";
import CommentIcon from "@/components/icons/CommentIcon";
import type { CommunityPost } from "@/types/communityPost";

interface CommunityPostItemProps {
  post: CommunityPost;
  onClick: () => void;
}

export default function CommunityPostItem({ post, onClick }: CommunityPostItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full cursor-pointer flex-col gap-[12px] border-b border-gray-100 py-[20px] text-left"
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
    </button>
  );
}
