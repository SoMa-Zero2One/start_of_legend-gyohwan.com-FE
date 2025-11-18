"use client";

import { useMemo, useState } from "react";
import CountryListItem from "@/components/community/CountryListItem";
import SearchIcon from "@/components/icons/SearchIcon";
import type { EnrichedCountry, Continent } from "@/types/community";
import { CONTINENTS } from "@/types/community";

interface CountryContentProps {
  countries: EnrichedCountry[];
}

// 클라이언트 컴포넌트 (인터랙션 처리)
export default function CountryContent({ countries }: CountryContentProps) {
  const [activeContinents, setActiveContinents] = useState<Continent[]>(CONTINENTS);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = useMemo(() => {
    let result = countries;

    // 1단계: 대륙 필터링
    if (activeContinents.length !== CONTINENTS.length) {
      result = result.filter((country) => activeContinents.includes(country.continent));
    }

    // 2단계: 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((country) => {
        const name = country.name?.toLowerCase() || "";
        return name.includes(query);
      });
    }

    return result;
  }, [countries, activeContinents, searchQuery]);

  const handleToggleContinent = (continent: Continent) => {
    setActiveContinents((prev) =>
      prev.includes(continent) ? prev.filter((item) => item !== continent) : [...prev, continent]
    );
  };

  const isAllSelected = activeContinents.length === CONTINENTS.length;
  const handleSelectAll = () => setActiveContinents(CONTINENTS);

  return (
    <div className="flex flex-1 flex-col">
      {/* 검색 모드가 아닐 때: 전체 제목 + 검색 버튼 */}
      {!isSearchMode && (
        <div className="flex items-center justify-between px-[20px] py-4">
          <div>
            <h2 className="subhead-1">전체 ({filteredCountries.length})</h2>
            <p className="caption-2 mt-[4px] text-gray-700">나라를 선택해 자세한 정보를 확인하세요</p>
          </div>
          <button
            onClick={() => setIsSearchMode(true)}
            className="flex h-[24px] w-[24px] cursor-pointer items-center justify-center"
          >
            <SearchIcon size={20} />
          </button>
        </div>
      )}

      {/* 검색 모드일 때: 검색창 */}
      {isSearchMode && (
        <div className="px-[20px] py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="나라 이름으로 검색..."
                className="w-full rounded-[4px] bg-gray-100 py-1 pr-3 pl-10 text-[14px] focus:outline-none"
                autoFocus
              />
              <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                <SearchIcon size={16} />
              </div>
            </div>
            <button
              onClick={() => {
                setIsSearchMode(false);
                setSearchQuery("");
              }}
              className="caption-2 cursor-pointer text-gray-600 hover:text-gray-900"
            >
              취소
            </button>
          </div>
          <p className="caption-2 mt-[4px] text-gray-700">검색 결과 ({filteredCountries.length})</p>
        </div>
      )}

      <div className="px-[20px] pb-4">
        <div className="flex flex-wrap gap-[8px]">
          <FilterChip label="전체" active={isAllSelected} onClick={handleSelectAll} />
          {CONTINENTS.map((continent) => (
            <FilterChip
              key={continent}
              label={continent}
              active={activeContinents.includes(continent)}
              onClick={() => handleToggleContinent(continent)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[12px] px-[20px] pb-[80px]">
        {filteredCountries.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-[60px]">
            <p className="body-2 text-gray-500">선택한 대륙에 해당하는 나라가 없습니다</p>
          </div>
        ) : (
          filteredCountries.map((country) => <CountryListItem key={country.countryCode} country={country} />)
        )}
      </div>
    </div>
  );
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`caption-2 rounded-full px-[14px] py-[6px] transition-colors ${
        active ? "bg-primary-blue text-white" : "bg-gray-100 text-gray-700"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
