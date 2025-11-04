import { Suspense } from "react";
import Header from "@/components/layout/Header";
import { fetchCountries } from "@/lib/api/community";
import { enrichCountryData } from "@/lib/utils/countryTransform";
import CountryContent from "./CountryContent";

// 빌드 시 pre-rendering 비활성화 (동적 페이지)
export const dynamic = "force-dynamic";

// 서버 컴포넌트
export default async function CommunityPage() {
  // 서버에서 데이터 fetch
  const apiData = await fetchCountries();
  const countries = enrichCountryData(apiData);

  return (
    <>
      <Header title="커뮤니티" showPrevButton showHomeButton />
      <Suspense fallback={<div className="p-[20px]">Loading...</div>}>
        <CountryContent countries={countries} />
      </Suspense>
    </>
  );
}
