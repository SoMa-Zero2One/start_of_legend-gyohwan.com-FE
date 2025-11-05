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
export default async function CommunityPage() {
  try {
    // 서버에서 데이터 fetch (병렬 처리)
    const [countriesData, universitiesData] = await Promise.all([fetchCountries(), fetchUniversities()]);
    const countries = enrichCountryData(countriesData);
    const universities = enrichUniversityData(universitiesData);

    return (
      <>
        <div className="flex min-h-screen flex-col">
          <Header title="커뮤니티" showPrevButton showHomeButton />
          <Suspense fallback={<div className="p-[20px]">Loading...</div>}>
            <CommunityTabs countries={countries} universities={universities} />
          </Suspense>
        </div>
        <Footer />
      </>
    );
  } catch (error) {
    console.error("[CommunityPage] 데이터 fetch 실패:", error);
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
