"use client";

import { useState } from "react";
import UniversityTable from "@/components/community/UniversityTable";
import UniversityFilterModal from "@/components/community/UniversityFilterModal";
import FilterIcon from "@/components/icons/FilterIcon";
import { EnrichedUniversity, Continent } from "@/types/community";
import { useUniversityTable } from "@/hooks/useUniversityTable";

interface UniversityContentProps {
  universities: EnrichedUniversity[];
}

// 클라이언트 컴포넌트 (인터랙션 처리)
export default function UniversityContent({ universities }: UniversityContentProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 커스텀 훅으로 정렬/필터 관리
  const {
    sortedUniversities,
    sortConfig,
    handleSort,
    visibleFieldKeys,
    setVisibleFieldKeys,
    selectedCountries,
    setSelectedCountries,
    activeContinents,
    setActiveContinents,
  } = useUniversityTable(universities);

  // 필터 적용 핸들러
  const handleApplyFilter = (countries: string[], fieldKeys: string[], continents: Continent[]) => {
    setSelectedCountries(countries);
    setVisibleFieldKeys(fieldKeys);
    setActiveContinents(continents);
  };

  return (
    <>
      {/* 전체 개수 + 필터 버튼 */}
      <div className="flex items-center justify-between px-[20px] py-4">
        <h2 className="subhead-1">전체 ({sortedUniversities.length})</h2>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-primary-blue flex cursor-pointer items-center gap-[4px] rounded-md px-[10px] py-[6px] text-white"
        >
          <span className="caption-2">필터</span>
          <FilterIcon size={20} />
        </button>
      </div>

      {/* 대학 테이블 */}
      <UniversityTable
        universities={sortedUniversities}
        visibleFieldKeys={visibleFieldKeys}
        onSort={handleSort}
        sortConfig={sortConfig}
      />

      {/* 필터 모달 */}
      <UniversityFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCountries={selectedCountries}
        visibleFieldKeys={visibleFieldKeys}
        activeContinents={activeContinents}
        onApply={handleApplyFilter}
        universities={universities}
      />
    </>
  );
}
