"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Tabs from "@/components/common/Tabs";
import CountryContent from "./CountryContent";
import UniversityContent from "./UniversityContent";
import { EnrichedCountry, EnrichedUniversity } from "@/types/community";

type TabType = "나라" | "대학";

const TABS: TabType[] = ["나라", "대학"];

interface CommunityTabsProps {
  countries: EnrichedCountry[];
  universities: EnrichedUniversity[];
}

export default function CommunityTabs({ countries, universities }: CommunityTabsProps) {
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
      {/* <Tabs tabs={TABS} selectedTab={currentTab} onTabChange={handleTabChange} />

      <div style={{ display: currentTab === "나라" ? "flex" : "none" }} className="flex flex-1 flex-col">
        <CountryContent countries={countries} />
      </div> */}
      {/* style 다시 추 */}
      <div className="flex flex-1 flex-col">
        <UniversityContent universities={universities} />
      </div>
    </div>
  );
}
