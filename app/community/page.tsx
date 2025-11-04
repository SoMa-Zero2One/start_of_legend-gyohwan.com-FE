import { Suspense } from "react";
import Header from "@/components/layout/Header";
import { fetchCountries, fetchUniversities } from "@/lib/api/community";
import { enrichCountryData } from "@/lib/utils/countryTransform";
import CommunityTabs from "./CommunityTabs";
import Footer from "@/components/layout/Footer";
import { enrichUniversityData } from "@/lib/utils/universityTransform";

// 빌드 시 pre-rendering 비활성화 (동적 페이지)
export const dynamic = "force-dynamic";

// 서버 컴포넌트
export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  // 서버에서 데이터 fetch
  const [countriesData, universitiesData] = await Promise.all([fetchCountries(), fetchUniversities()]);
  const countries = enrichCountryData(countriesData);
  const universities = enrichUniversityData(universitiesData);

  return (
    <>
      <Header title="커뮤니티" showPrevButton showHomeButton />
      <Suspense fallback={<div className="p-[20px]">Loading...</div>}>
        <CommunityTabs countries={countries} universities={universities} />
      </Suspense>
      <Footer />
    </>
  );
}
