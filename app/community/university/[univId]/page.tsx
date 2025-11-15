import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UniversityDetailContent from "@/components/university/UniversityDetailContent";
import { getUniversityDetail } from "@/lib/api/university";
import { getUniversityCommunityPosts } from "@/lib/api/communityPosts";

interface UniversityDetailPageProps {
  params: Promise<{ univId: string }>;
}

/**
 * USAGE: /community/university/[univId] 경로
 *
 * WHAT: 대학 상세 정보 페이지 (서버 컴포넌트)
 *
 * WHY:
 * - 서버에서 데이터 fetch → SEO 최적화
 * - Next.js 캐싱 활용 (revalidate: 3600초)
 * - 404 에러 처리로 자연스러운 UX
 *
 * ALTERNATIVES:
 * - 클라이언트 컴포넌트 (rejected: SEO 불리, 초기 로딩 느림)
 */
export default async function UniversityDetailPage({ params }: UniversityDetailPageProps) {
  const { univId } = await params;
  const univIdNum = parseInt(univId, 10);

  // univId가 숫자가 아니면 404
  if (isNaN(univIdNum)) {
    notFound();
  }

  // 대학 정보 및 커뮤니티 게시글 병렬 조회 (TTFB 최적화)
  const [universityData, communityPostsResponse] = await Promise.all([
    getUniversityDetail(univIdNum).catch((error) => {
      // 404 에러 (존재하지 않는 대학 ID)
      if (error instanceof Error && error.message.includes("찾을 수 없습니다")) {
        notFound();
      }
      // 그 외 에러 (500, 네트워크 등) → 상위로 전파하여 error.tsx에서 처리
      throw error;
    }),
    getUniversityCommunityPosts(univIdNum, {
      page: 0,
      limit: 20,
    }).catch(() => {
      // 커뮤니티 글 조회 실패 시 빈 배열 반환 (페이지는 계속 표시)
      return { posts: [], pagination: { totalItems: 0, totalPages: 0, currentPage: 0, limit: 5 } };
    }),
  ]);

  const communityPosts = communityPostsResponse.posts;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white">
        <Header showPrevButton showHomeButton />
      </div>

      <main className="mx-auto w-full max-w-[430px] flex-1">
        <UniversityDetailContent universityData={universityData} communityPosts={communityPosts} />
      </main>

      <Footer />
    </div>
  );
}
