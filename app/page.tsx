import type { Metadata } from "next";
import type { Season } from "@/types/season";
import { getSeasons } from "@/lib/api/season";
import HomePage from "@/components/home/HomePage";
import StructuredData from "@/components/common/StructuredData";
import { getSiteUrl } from "@/lib/utils/siteUrl";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

// 캐싱 완전 비활성화 - 항상 최신 데이터 조회
export const dynamic = 'force-dynamic';

const fetchSeasonList = async ({ expired, label }: { expired: boolean; label: string }): Promise<Season[]> => {
  try {
    const data = await getSeasons({ expired });
    if (data.seasons === null) {
      console.warn(`[HOME WARNING] ${label} seasons is null - homepage will show 0 universities`);
      return [];
    }
    return data.seasons;
  } catch (error) {
    console.error(`Failed to fetch ${label} seasons:`, error);
    return [];
  }
};

export default async function Page() {
  const siteUrl = getSiteUrl();

  // JSON-LD 구조화 데이터
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "교환닷컴",
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
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
  const [initialSeasons, initialPastSeasons] = await Promise.all([
    fetchSeasonList({ expired: false, label: "active" }),
    fetchSeasonList({ expired: true, label: "expired" }),
  ]);

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <HomePage initialSeasons={initialSeasons} initialPastSeasons={initialPastSeasons} />
    </>
  );
}
