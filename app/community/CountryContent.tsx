"use client";

import { useState } from "react";
import CountryTable from "@/components/community/CountryTable";
import CountryFilterModal from "@/components/community/CountryFilterModal";
import FilterIcon from "@/components/icons/FilterIcon";
import { EnrichedCountry } from "@/types/community";
import { useCountryTable } from "@/hooks/useCountryTable";
import { Continent } from "@/types/community";

interface CountryContentProps {
  countries: EnrichedCountry[];
}

// 클라이언트 컴포넌트 (인터랙션 처리)
export default function CountryContent({ countries }: CountryContentProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showFilledOnly, setShowFilledOnly] = useState(true);

  // 커스텀 훅으로 정렬/필터 관리
  const {
    sortedCountries,
    sortConfig,
    handleSort,
    visibleFieldKeys,
    setVisibleFieldKeys,
    selectedContinents,
    setSelectedContinents,
  } = useCountryTable(countries);

  // 필터 적용 핸들러
  const handleApplyFilter = (continents: Continent[], fieldKeys: string[]) => {
    setSelectedContinents(continents);
    setVisibleFieldKeys(fieldKeys);
  };

  // showFilledOnly가 true면 모든 필드가 null인 나라 제외
  const displayedCountries = showFilledOnly ? sortedCountries.filter((country) => country.isFilled) : sortedCountries;

  return (
    <>
      {/* 전체 개수 + 필터 버튼 */}
      <div className="flex items-center justify-between px-[20px] py-4">
        <div>
          <h2 className="subhead-1">전체 ({displayedCountries.length})</h2>
          <p className="caption-2 mt-[4px] text-gray-700">행을 클릭하여 나라 상세 정보를 확인하세요</p>
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-primary-blue flex cursor-pointer items-center gap-[4px] rounded-md px-[10px] py-[6px] text-white"
        >
          <span className="caption-2">필터</span>
          <FilterIcon size={20} />
        </button>
      </div>

      {/* 정보 입력된 항목만 보기 토글 */}
      <div className="flex items-center gap-[12px] px-[20px] pb-4">
        <button
          onClick={() => setShowFilledOnly(!showFilledOnly)}
          className={`relative h-[18px] w-[32px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
            showFilledOnly ? "bg-primary-blue" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15)] transition-transform duration-200 ${
              showFilledOnly ? "translate-x-[16px]" : "translate-x-[2px]"
            }`}
          />
        </button>
        <span className="medium-body-3">정보 입력된 항목만 보기</span>
      </div>

      {/* 나라 테이블 */}
      <CountryTable
        countries={displayedCountries}
        visibleFieldKeys={visibleFieldKeys}
        onSort={handleSort}
        sortConfig={sortConfig}
      />

      {/* 필터 모달 */}
      <CountryFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedContinents={selectedContinents as Continent[]}
        visibleFieldKeys={visibleFieldKeys}
        onApply={handleApplyFilter}
      />
    </>
  );
}
