import { notFound } from "next/navigation";
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
 * - 404 에러 처리로 자연스러운 사용자 경험
 *
 * ALTERNATIVES:
 * - 클라이언트 컴포넌트로 전체 구현 (rejected: SEO 불리, 초기 로딩 느림)
 */
export default async function UniversitiesPage({ params }: UniversitiesPageProps) {
  const { countryCode } = await params;
  const upperCountryCode = countryCode.toUpperCase();

  // 국가 정보 조회 with 에러 핸들링
  const data = await getCountryDetail(upperCountryCode).catch((error) => {
    // 404 에러 (존재하지 않는 국가 코드)
    if (error instanceof Error && error.message.includes("찾을 수 없습니다")) {
      notFound();
    }
    // 그 외 에러 (500, 네트워크 등) → 상위로 전파하여 error.tsx에서 처리
    throw error;
  });

  const countryName = data.name || upperCountryCode;
  const universities = data.universities || [];

  return (
    <div className="flex min-h-screen flex-col">
      <UniversityListClient countryName={countryName} universities={universities} />

      <Footer />
    </div>
  );
}
