"use client";

import { Suspense, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Tabs from "@/components/common/Tabs";
import CommunityTable from "@/components/community/CommunityTable";
import FilterModal from "@/components/community/FilterModal";
import FilterIcon from "@/components/icons/FilterIcon";
import { mockCountries, mockUniversities } from "@/mocks/data/community";
import { CountryFilterOptions, UniversityFilterOptions } from "@/types/community";

function CommunityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "대학" ? "대학" : "나라";

  // 필터 모달 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 나라 탭 필터 상태
  const [countryFilters, setCountryFilters] = useState<CountryFilterOptions>({
    continent: null,
    showVisaDifficulty: true,
    showCost: true,
    showLanguage: true,
  });

  // 대학 탭 필터 상태
  const [universityFilters, setUniversityFilters] = useState<UniversityFilterOptions>({
    continent: null,
    showBudget: true,
    showTravel: true,
    showCost: true,
    showProgram: true,
    showCityType: true,
    showSafety: true,
    showTransportation: true,
    showDorm: true,
    showDormCost: true,
    showQsRanking: true,
    showSchoolType: true,
  });

  // 필터링된 데이터
  const filteredCountries = useMemo(() => {
    if (!countryFilters.continent) return mockCountries;
    return mockCountries.filter((country) => country.continent === countryFilters.continent);
  }, [countryFilters.continent]);

  const filteredUniversities = useMemo(() => {
    if (!universityFilters.continent) return mockUniversities;
    return mockUniversities.filter((university) => university.continent === universityFilters.continent);
  }, [universityFilters.continent]);

  // 표시할 컬럼 계산
  const visibleCountryColumns = useMemo(() => {
    const columns = [];
    if (countryFilters.showVisaDifficulty) columns.push("visaDifficulty");
    if (countryFilters.showCost) columns.push("cost");
    if (countryFilters.showLanguage) columns.push("language");
    return columns;
  }, [countryFilters]);

  const visibleUniversityColumns = useMemo(() => {
    const columns = [];
    if (universityFilters.showBudget) columns.push("budget");
    if (universityFilters.showTravel) columns.push("travel");
    if (universityFilters.showCost) columns.push("cost");
    if (universityFilters.showProgram) columns.push("program");
    if (universityFilters.showCityType) columns.push("cityType");
    if (universityFilters.showSafety) columns.push("safety");
    if (universityFilters.showTransportation) columns.push("transportation");
    if (universityFilters.showDorm) columns.push("dorm");
    if (universityFilters.showDormCost) columns.push("dormCost");
    if (universityFilters.showQsRanking) columns.push("qsRanking");
    if (universityFilters.showSchoolType) columns.push("schoolType");
    return columns;
  }, [universityFilters]);

  const handleTabChange = (tab: "나라" | "대학") => {
    router.replace(`/community?tab=${tab}`);
  };

  const handleFilterApply = (filters: CountryFilterOptions | UniversityFilterOptions) => {
    if (activeTab === "나라") {
      setCountryFilters(filters as CountryFilterOptions);
    } else {
      setUniversityFilters(filters as UniversityFilterOptions);
    }
  };

  const itemCount = activeTab === "나라" ? filteredCountries.length : filteredUniversities.length;

  return (
    <>
      <Header title="커뮤니티" showPrevButton showHomeButton />

      {/* 탭 */}
      <Tabs tabs={["나라", "대학"]} selectedTab={activeTab} onTabChange={handleTabChange} />

      {/* 전체 개수 + 필터 버튼 */}
      <div className="flex items-center justify-between px-[20px] py-4">
        <h2 className="subhead-1">전체 ({itemCount})</h2>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-primary-blue flex items-center gap-[4px] rounded-md py-[4px] pr-[6px] pl-[10px] text-white"
        >
          <span className="caption-2">필터</span>
          <FilterIcon size={20} />
        </button>
      </div>

      {/* 테이블 */}
      <CommunityTable
        type={activeTab === "나라" ? "country" : "university"}
        countries={activeTab === "나라" ? filteredCountries : undefined}
        universities={activeTab === "대학" ? filteredUniversities : undefined}
        visibleColumns={activeTab === "나라" ? visibleCountryColumns : visibleUniversityColumns}
      />

      {/* 필터 모달 */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        type={activeTab === "나라" ? "country" : "university"}
        currentFilters={activeTab === "나라" ? countryFilters : universityFilters}
        onApply={handleFilterApply}
      />
    </>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommunityContent />
    </Suspense>
  );
}
