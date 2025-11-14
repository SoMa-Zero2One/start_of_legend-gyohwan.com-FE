import PostDetailPageClient from "@/components/community/PostDetailPageClient";

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
  return <PostDetailPageClient postId={postIdNumber} />;
}
