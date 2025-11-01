import type { Metadata } from "next";
import { getSeasons } from "@/lib/api/season";
import HomePage from "@/components/home/HomePage";
import StructuredData from "@/components/common/StructuredData";

// 24시간(86400초)마다 자동 재생성
export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Page() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gyohwan.com";

  // JSON-LD 구조화 데이터
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "교환닷컴",
    url: siteUrl,
    logo: `${siteUrl}/logos/logo-blue.svg`,
    description: "교환학생 정보 공유 플랫폼. 실시간 지원 현황, GPA·어학성적 비교, 파견교 정보를 제공합니다.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "교환닷컴",
    url: siteUrl,
    description: "교환학생 준비부터 파견까지, 서로 정보를 공유하며 함께 준비하세요.",
  };

  // 서버에서 시즌 목록만 가져오기 (인증 불필요)
  const initialSeasons = await getSeasons()
    .then((data) => data.seasons)
    .catch((error) => {
      console.error("Failed to fetch seasons:", error);
      // API 실패 시 빈 배열로 fallback (빌드/재생성 중 에러 방지)
      return [];
    });

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <HomePage initialSeasons={initialSeasons} />
    </>
  );
}
