"use client";

import { useState } from "react";
import CountryTable from "@/components/community/CountryTable";
import CountryFilterModal, { Continent } from "@/components/community/CountryFilterModal";
import FilterIcon from "@/components/icons/FilterIcon";
import { EnrichedCountry } from "@/types/community";
import { useCountryTable } from "@/hooks/useCountryTable";

interface CountryContentProps {
  countries: EnrichedCountry[];
}

// 클라이언트 컴포넌트 (인터랙션 처리)
export default function CountryContent({ countries }: CountryContentProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  return (
    <>
      {/* 전체 개수 + 필터 버튼 */}
      <div className="flex items-center justify-between px-[20px] py-4">
        <h2 className="subhead-1">전체 ({sortedCountries.length})</h2>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-primary-blue flex items-center gap-[4px] rounded-md px-[10px] py-[6px] text-white cursor-pointer"
        >
          <span className="caption-2">필터</span>
          <FilterIcon size={20} />
        </button>
      </div>

      {/* 나라 테이블 */}
      <CountryTable
        countries={sortedCountries}
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
