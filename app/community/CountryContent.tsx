"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import CountryListItem from "@/components/community/CountryListItem";
import type { EnrichedCountry, Continent } from "@/types/community";
import { CONTINENTS } from "@/types/community";

interface CountryContentProps {
  countries: EnrichedCountry[];
}

const COUNTRY_LOAD_CHUNK = 30;

// 클라이언트 컴포넌트 (인터랙션 처리)
export default function CountryContent({ countries }: CountryContentProps) {
  const [activeContinents, setActiveContinents] = useState<Continent[]>(CONTINENTS);
  const [visibleCount, setVisibleCount] = useState(COUNTRY_LOAD_CHUNK);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filteredCountries = useMemo(() => {
    if (activeContinents.length === CONTINENTS.length) return countries;
    return countries.filter((country) => activeContinents.includes(country.continent));
  }, [countries, activeContinents]);

  useEffect(() => {
    setVisibleCount(Math.min(COUNTRY_LOAD_CHUNK, filteredCountries.length || COUNTRY_LOAD_CHUNK));
  }, [filteredCountries.length]);

  const visibleCountries = useMemo(() => {
    return filteredCountries.slice(0, visibleCount);
  }, [filteredCountries, visibleCount]);

  const hasMoreCountries = visibleCount < filteredCountries.length;

  useEffect(() => {
    if (!hasMoreCountries) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + COUNTRY_LOAD_CHUNK, filteredCountries.length));
        }
      },
      { rootMargin: "120px 0px" }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
      observer.disconnect();
    };
  }, [hasMoreCountries, filteredCountries.length]);

  const handleToggleContinent = (continent: Continent) => {
    setActiveContinents((prev) =>
      prev.includes(continent) ? prev.filter((item) => item !== continent) : [...prev, continent]
    );
  };

  const isAllSelected = activeContinents.length === CONTINENTS.length;
  const handleSelectAll = () => setActiveContinents(CONTINENTS);

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-[20px] py-4">
        <h2 className="subhead-1">전체 ({filteredCountries.length})</h2>
        <p className="caption-2 mt-[4px] text-gray-700">나라를 선택해 자세한 정보를 확인하세요</p>
      </div>

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

      <div className="flex flex-1 flex-col gap-[12px] px-[20px] pb-[40px]">
        {filteredCountries.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-[60px]">
            <p className="body-2 text-gray-500">선택한 대륙에 해당하는 나라가 없습니다</p>
          </div>
        ) : (
          visibleCountries.map((country) => <CountryListItem key={country.countryCode} country={country} />)
        )}
      </div>

      {hasMoreCountries && (
        <div ref={sentinelRef} className="flex justify-center px-[20px] pb-[40px] text-gray-500">
          <span className="caption-1">불러오는 중...</span>
        </div>
      )}
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
