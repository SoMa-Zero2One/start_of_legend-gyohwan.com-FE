import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CountryDetailContent from "@/components/country/CountryDetailContent";
import { getCountryDetail } from "@/lib/api/country";
import { getCountryCommunityPosts } from "@/lib/api/communityPosts";

interface CountryDetailPageProps {
  params: Promise<{ countryCode: string }>;
}

// 서버 컴포넌트
export default async function CountryDetailPage({ params }: CountryDetailPageProps) {
  const { countryCode } = await params;
  const upperCountryCode = countryCode.toUpperCase();

  // 국가 정보 및 커뮤니티 게시글 병렬 조회 (TTFB 최적화)
  const [countryData, communityPostsData] = await Promise.all([
    getCountryDetail(upperCountryCode).catch((error) => {
      // 404 에러 (존재하지 않는 국가 코드)
      if (error instanceof Error && error.message.includes("찾을 수 없습니다")) {
        notFound();
      }
      // 그 외 에러 (500, 네트워크 등) → 상위로 전파하여 error.tsx에서 처리
      throw error;
    }),
    getCountryCommunityPosts(upperCountryCode, { limit: 10 }).catch((error) => {
      console.error("[CountryDetailPage] 커뮤니티 게시글 조회 실패:", error);
      return { pagination: { totalItems: 0, totalPages: 0, currentPage: 0, limit: 10 }, posts: [] };
    }),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white">
        <Header showPrevButton showHomeButton />
      </div>

      <main className="mx-auto w-full max-w-[430px] flex-1">
        <CountryDetailContent countryData={countryData} communityPosts={communityPostsData.posts} />
      </main>

      <Footer />
    </div>
  );
}
