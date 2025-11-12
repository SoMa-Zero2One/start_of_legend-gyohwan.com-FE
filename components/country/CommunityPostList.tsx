import CommunityPostItem from "./CommunityPostItem";
import WritePostButton from "@/components/community/WritePostButton";
import type { CommunityPost } from "@/types/communityPost";

interface CommunityPostListProps {
  posts: CommunityPost[];
  countryCode?: string; // 국가 커뮤니티일 때
  outgoingUnivId?: number; // 대학 커뮤니티일 때
}

export default function CommunityPostList({ posts, countryCode, outgoingUnivId }: CommunityPostListProps) {
  // Empty state 처리
  if (!posts || posts.length === 0) {
    return (
      <>
        <div className="flex items-center justify-between px-[20px] pt-[24px] pb-[20px]">
          <h2 className="head-4">커뮤니티</h2>
          {(countryCode || outgoingUnivId) && (
            <WritePostButton countryCode={countryCode} outgoingUnivId={outgoingUnivId} />
          )}
        </div>
        <div className="flex items-center justify-center py-[60px]">
          <p className="text-gray-500">아직 작성된 게시글이 없습니다</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* 제목 + 글쓰기 버튼 */}
      <div className="flex items-center justify-between px-[20px] pt-[24px] pb-[20px]">
        <h2 className="head-4">커뮤니티</h2>
        {(countryCode || outgoingUnivId) && (
          <WritePostButton countryCode={countryCode} outgoingUnivId={outgoingUnivId} />
        )}
      </div>

      {/* 게시글 목록 */}
      <div className="flex flex-col pb-[20px]">
        {posts.map((post, index) => (
          <CommunityPostItem key={post.postId} post={post} isLast={index === posts.length - 1} />
        ))}
      </div>
    </>
  );
}
