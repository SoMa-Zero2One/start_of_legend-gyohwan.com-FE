import { promises as fs } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import type { Season } from "@/types/season";
import type { GetSeasonOptions } from "@/lib/api/season";
import { getSeasons } from "@/lib/api/season";
import HomePage from "@/components/home/HomePage";
import StructuredData from "@/components/common/StructuredData";
import { getSiteUrl } from "@/lib/utils/siteUrl";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

// 서버 캐싱 사용, 필요 시 on-demand revalidate로 갱신
export const revalidate = 60 * 60 * 12;

const FALLBACK_PAST_SEASONS_PATH = path.join(process.cwd(), "public/data/pastSeasons.json");

const fetchSeasonList = async ({
  label,
  ...options
}: { label: string } & GetSeasonOptions): Promise<Season[]> => {
  try {
    const data = await getSeasons(options);
    if (data.seasons === null) {
      console.warn(`[HOME WARNING] ${label} seasons is null - homepage will show 0 universities`);
      return [];
    }
    return data.seasons ?? [];
  } catch (error) {
    console.error(`Failed to fetch ${label} seasons:`, error);
    return [];
  }
};

const loadFallbackPastSeasons = async (): Promise<Season[]> => {
  try {
    const json = await fs.readFile(FALLBACK_PAST_SEASONS_PATH, "utf-8");
    const parsed = JSON.parse(json) as { seasons?: Season[] | null };
    return parsed.seasons ?? [];
  } catch (error) {
    console.error("[HOME ERROR] Failed to load fallback past seasons:", error);
    return [];
  }
};

const hasSeasonOverlap = (active: Season[], past: Season[]): boolean => {
  if (active.length === 0 || past.length === 0) {
    return false;
  }
  const activeIds = new Set(active.map((season) => season.seasonId));
  return past.some((season) => activeIds.has(season.seasonId));
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
  const [initialSeasons, pastSeasonsFromApi] = await Promise.all([
    fetchSeasonList({ expired: false, label: "active" }),
    fetchSeasonList({ expired: true, label: "expired" }),
  ]);

  const shouldUseFallback =
    pastSeasonsFromApi.length === 0 || hasSeasonOverlap(initialSeasons, pastSeasonsFromApi);

  let initialPastSeasons = pastSeasonsFromApi;

  if (shouldUseFallback) {
    const fallbackPastSeasons = await loadFallbackPastSeasons();
    if (fallbackPastSeasons.length > 0) {
      const reason =
        pastSeasonsFromApi.length === 0 ? "no rows returned" : "overlapping active season IDs";
      console.warn(
        `[HOME WARNING] expired seasons API ${reason} - falling back to static dataset for past seasons`
      );
      initialPastSeasons = fallbackPastSeasons;
    } else {
      console.warn(
        "[HOME WARNING] unable to load fallback past seasons - using API response even though it may be incomplete"
      );
    }
  }

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <HomePage initialSeasons={initialSeasons} initialPastSeasons={initialPastSeasons} />
    </>
  );
}
