import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CommunityPostList from "@/components/country/CommunityPostList";
import Pagination from "@/components/common/Pagination";
import { getCountryCommunityPosts } from "@/lib/api/communityPosts";

interface TalksPageProps {
  params: Promise<{ countryCode: string }>;
  searchParams: Promise<{ page?: string }>;
}

// 서버 컴포넌트 - 국가별 커뮤니티 전체 목록 페이지
export default async function TalksPage({ params, searchParams }: TalksPageProps) {
  const { countryCode } = await params;
  const { page = "1" } = await searchParams;
  const upperCountryCode = countryCode.toUpperCase();

  // 페이지 번호 파싱 (1-based → 0-based for API)
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const apiPage = currentPage - 1; // API는 0-based

  try {
    // 커뮤니티 게시글 조회
    const data = await getCountryCommunityPosts(upperCountryCode, {
      page: apiPage,
      limit: 10,
    });

    const { posts, pagination, countryName } = data;

    // countryName fallback 처리 (방어적 코딩)
    const displayName = countryName || upperCountryCode;

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
              baseUrl={`/community/country/${upperCountryCode}/talks`}
            />
          )}
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch community posts:", error);
    notFound();
  }
}
