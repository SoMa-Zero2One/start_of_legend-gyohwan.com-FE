import Footer from "@/components/layout/Footer";
import UniversityListClient from "@/components/country/UniversityListClient";
import { getCountryDetail } from "@/lib/api/country";

interface UniversitiesPageProps {
  params: Promise<{ countryCode: string }>;
}

/**
 * USAGE: /community/country/[code]/universities 경로
 *
 * WHAT: 특정 국가의 모든 대학 목록을 보여주는 페이지 (서버 컴포넌트)
 *
 * WHY:
 * - 서버에서 데이터 fetch → SEO 최적화 (대학 목록이 HTML에 포함)
 * - Next.js 캐싱 활용 (revalidate: 3600초)
 * - 초기 로딩 속도 향상 (클라이언트 JS 실행 전에 데이터 준비)
 *
 * ALTERNATIVES:
 * - 클라이언트 컴포넌트로 전체 구현 (rejected: SEO 불리, 초기 로딩 느림)
 */
export default async function UniversitiesPage({ params }: UniversitiesPageProps) {
  const { countryCode } = await params;

  // 서버에서 데이터 fetch
  const data = await getCountryDetail(countryCode);

  const countryName = data.name || countryCode.toUpperCase();
  const universities = data.universities || [];

  return (
    <div className="flex min-h-screen flex-col">
      <UniversityListClient countryName={countryName} universities={universities} />

      <Footer />
    </div>
  );
}
