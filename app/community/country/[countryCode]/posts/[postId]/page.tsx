import { getPostDetail } from "@/lib/api/community";
import Header from "@/components/layout/Header";
import PostDetailContent from "@/components/community/PostDetailContent";
import PostActionMenuButton from "@/components/community/PostActionMenuButton";
import CommentList from "@/components/community/CommentList";
import CommentInputButton from "@/components/community/CommentInputButton";

// 항상 최신 데이터를 fetch (캐시 사용 안 함)
export const dynamic = "force-dynamic";

interface CountryPostDetailPageProps {
  params: Promise<{ countryCode: string; postId: string }>;
}

/**
 * 국가별 커뮤니티 게시글 상세 페이지
 *
 * USAGE: /community/country/[countryCode]/posts/[postId] 경로로 접근
 *
 * WHAT: 특정 국가 커뮤니티의 게시글 상세 정보 + 댓글 목록 표시
 *
 * WHY:
 * - Server Component로 초기 데이터 fetch (SEO 최적화)
 * - 국가별 커뮤니티 게시글 구분
 * - 삭제 후 올바른 목록으로 복귀 가능
 */
export default async function CountryPostDetailPage({ params }: CountryPostDetailPageProps) {
  const { postId } = await params;
  const postIdNumber = parseInt(postId, 10);

  // 게시글 상세 정보 조회 (댓글 포함)
  let post;
  try {
    post = await getPostDetail(postIdNumber);
  } catch (error) {
    // 게시글이 없거나 오류 발생 시 에러 페이지 표시
    return (
      <div className="flex min-h-screen flex-col">
        <div className="sticky top-0 z-20 bg-white">
          <Header showPrevButton showHomeButton showBorder />
        </div>
        <main className="mx-auto flex w-full max-w-[430px] flex-1 flex-col items-center justify-center px-[20px] text-center">
          <p className="body-1 text-gray-900">게시글을 불러올 수 없습니다.</p>
          <p className="caption-2 mt-[8px] text-gray-700">
            {error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header: 뒤로가기 + 더보기 메뉴 */}
      <div className="sticky top-0 z-20 bg-white">
        <Header showPrevButton showHomeButton showBorder>
          <PostActionMenuButton post={post} />
        </Header>
      </div>

      {/* 게시글 본문 */}
      <main className="mx-auto w-full max-w-[430px] flex-1 px-[20px] py-[24px]">
        <PostDetailContent post={post} />

        {/* 댓글 목록 */}
        <div className="mt-[32px]">
          <CommentList comments={post.comments || []} postId={postIdNumber} />
        </div>

        {/* 하단 여백 (고정 버튼 공간 확보) */}
        <div className="h-[80px]" />
      </main>

      {/* 하단 고정 댓글 입력 버튼 */}
      <CommentInputButton postId={postIdNumber} />
    </div>
  );
}
