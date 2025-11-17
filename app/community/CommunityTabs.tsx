"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Tabs from "@/components/common/Tabs";
import CountryContent from "./CountryContent";
import UniversityContent from "./UniversityContent";
import CountrySkeleton from "@/components/community/CountrySkeleton";
import UniversitySkeleton from "@/components/community/UniversitySkeleton";
import { EnrichedCountry, EnrichedUniversity } from "@/types/community";

type TabType = "나라" | "대학";

const TABS: TabType[] = ["나라", "대학"];

interface CommunityTabsProps {
  countries: EnrichedCountry[];
  universities: EnrichedUniversity[];
  headerHeight: number; // Reserved for future sticky positioning features
  isCountryLoading: boolean;
  isUniversityLoading: boolean;
}

export default function CommunityTabs({
  countries,
  universities,
  headerHeight,
  isCountryLoading,
  isUniversityLoading,
}: CommunityTabsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // useState initializer function으로 hydration mismatch 방지
  const [currentTab, setCurrentTab] = useState<TabType>(() => {
    return searchParams.get("tab") === "대학" ? "대학" : "나라";
  });

  // URL이 변경되면 (브라우저 뒤로가기 등) 탭 상태 동기화
  useEffect(() => {
    const urlTab = searchParams.get("tab") === "대학" ? "대학" : "나라";
    // 불필요한 리렌더 방지: 탭이 실제로 변경되었을 때만 업데이트
    if (urlTab !== currentTab) {
      setCurrentTab(urlTab);
    }
  }, [searchParams, currentTab]);

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    // pathname 사용으로 locale/basePath 유지
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky z-20 bg-white" style={{ top: `${headerHeight}px` }}>
        <Tabs tabs={TABS} selectedTab={currentTab} onTabChange={handleTabChange} />
      </div>

      {currentTab === "나라" ? (
        <div className="flex flex-1 flex-col">
          {isCountryLoading ? (
            <div className="px-[20px] pt-4">
              <CountrySkeleton />
            </div>
          ) : (
            <CountryContent countries={countries} />
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          {isUniversityLoading ? (
            <div className="pt-4">
              <UniversitySkeleton />
            </div>
          ) : (
            <UniversityContent universities={universities} />
          )}
        </div>
      )}
    </div>
  );
}
