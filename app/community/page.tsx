import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchCountries, fetchUniversitiesPublic } from "@/lib/api/community";
import CommunityClient from "./CommunityClient";

// ISR: 60초마다 재생성 (캐싱 최적화)
export const revalidate = 60;

/**
 * Community 페이지 서버 컴포넌트
 *
 * 캐싱 전략:
 * - revalidate: 60초 (ISR - Incremental Static Regeneration)
 * - 첫 요청 후 60초간 캐시된 페이지 제공 (빠른 응답)
 * - 60초마다 백그라운드에서 자동 재생성 (최신 데이터 유지)
 * - 서버 부하 감소 및 응답 속도 대폭 향상
 *
 * SEO 최적화를 위한 Server + Client Hydration 패턴:
 * 1. 서버: fetchUniversitiesPublic으로 초기 데이터 제공 (SEO용)
 * 2. 클라이언트: CommunityClient에서 로그인 유저용 데이터 hydrate
 *
 * 장점:
 * - 검색 엔진이 전체 콘텐츠 인덱싱 가능 (SEO 완벽)
 * - 초기 로딩 빠름 (서버 렌더링 + 캐싱)
 * - 로그인 유저는 즐겨찾기 정보 표시 (클라이언트 hydration)
 */
export default async function CommunityPage() {
  try {
    // 서버: 공개 API로 초기 데이터 fetch (쿠키 없이, SEO용)
    const [countriesData, universitiesData] = await Promise.all([
      fetchCountries(),
      fetchUniversitiesPublic(), // 쿠키 없음, isFavorite 모두 false
    ]);

    // 클라이언트 컴포넌트로 raw 데이터 전달
    return <CommunityClient initialCountries={countriesData} initialUniversities={universitiesData} />;
  } catch (error) {
    console.error("[CommunityPage] 데이터 fetch 실패:", error);

    // 에러 시 fallback UI
    return (
      <>
        <div className="flex min-h-screen flex-col">
          <Header title="커뮤니티" showPrevButton showHomeButton />
          <div className="flex flex-1 items-center justify-center px-[20px] py-[60px]">
            <div className="text-center">
              <p className="body-2 text-gray-700">데이터를 불러오는데 실패했습니다.</p>
              <p className="caption-2 mt-[8px] text-gray-500">잠시 후 다시 시도해주세요.</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}
