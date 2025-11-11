import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CommunityPostList from "@/components/country/CommunityPostList";
import Pagination from "@/components/common/Pagination";
import { getUniversityCommunityPosts } from "@/lib/api/communityPosts";

interface TalksPageProps {
  params: Promise<{ univId: string }>;
  searchParams: Promise<{ page?: string }>;
}

// 서버 컴포넌트 - 대학별 커뮤니티 전체 목록 페이지
export default async function UniversityTalksPage({ params, searchParams }: TalksPageProps) {
  const { univId } = await params;
  const { page = "1" } = await searchParams;
  const univIdNum = parseInt(univId, 10);

  // univId가 숫자가 아니면 404
  if (isNaN(univIdNum)) {
    notFound();
  }

  // 페이지 번호 파싱 (1-based → 0-based for API)
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const apiPage = currentPage - 1; // API는 0-based

  try {
    // 커뮤니티 게시글 조회
    const data = await getUniversityCommunityPosts(univIdNum, {
      page: apiPage,
      limit: 10,
    });

    const { posts, pagination, outgoingUnivName } = data;

    // outgoingUnivName fallback 처리 (방어적 코딩)
    const displayName = outgoingUnivName || `University ${univId}`;

    // TODO: 페이지 범위 초과 시 처리
    // 현재는 빈 페이지를 보여주지만, 향후 마지막 페이지로 redirect 고려
    // if (currentPage > pagination.totalPages) {
    //   redirect(`/community/university/${univId}/talks?page=${pagination.totalPages}`);
    // }

    return (
      <div className="flex min-h-screen flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white">
          <Header title={`${displayName} 커뮤니티`} showPrevButton showHomeButton />
        </div>

        <main className="mx-auto w-full max-w-[430px] flex-1">
          <CommunityPostList posts={posts} />

          {/* 페이지네이션 - 페이지가 2개 이상일 때만 표시 */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              baseUrl={`/community/university/${univId}/talks`}
            />
          )}
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    // 404 에러 (존재하지 않는 대학/리소스)만 notFound()로 처리
    if (error instanceof Error && error.message.includes("찾을 수 없습니다")) {
      notFound();
    }

    // 그 외 에러 (500, 네트워크 오류 등)는 상위로 전파하여 error.tsx에서 처리
    console.error("Failed to fetch university community posts:", error);
    throw error;
  }
}
