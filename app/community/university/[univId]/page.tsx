import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UniversityDetailContent from "@/components/university/UniversityDetailContent";
import { getUniversityDetail } from "@/lib/api/university";

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

  // 대학 정보 조회 with 에러 핸들링
  const universityData = await getUniversityDetail(univIdNum).catch((error) => {
    // 404 에러 (존재하지 않는 대학 ID)
    if (error instanceof Error && error.message.includes("찾을 수 없습니다")) {
      notFound();
    }
    // 그 외 에러 (500, 네트워크 등) → 상위로 전파하여 error.tsx에서 처리
    throw error;
  });

  // 커뮤니티 게시글 조회
  // TODO: 백엔드에서 대학별 커뮤니티 API 지원 필요
  // 임시로 빈 배열 반환
  const communityPosts: never[] = [];

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
