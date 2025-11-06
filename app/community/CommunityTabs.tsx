"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

  // 초기 탭은 URL에서 읽기
  const initialTab: TabType = searchParams.get("tab") === "대학" ? "대학" : "나라";
  const [currentTab, setCurrentTab] = useState<TabType>(initialTab);

  // URL이 변경되면 (브라우저 뒤로가기 등) 탭 상태 동기화
  useEffect(() => {
    const urlTab = searchParams.get("tab") === "대학" ? "대학" : "나라";
    setCurrentTab(urlTab);
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    // URL 업데이트는 history API로 직접 (router.replace 안 씀)
    window.history.replaceState(null, "", `/community?tab=${tab}`);
  };

  return (
    <div className="flex flex-1 flex-col">
      <Tabs tabs={TABS} selectedTab={currentTab} onTabChange={handleTabChange} />

      <div style={{ display: currentTab === "나라" ? "flex" : "none" }} className="flex flex-1 flex-col">
        <CountryContent countries={countries} />
      </div>
      <div style={{ display: currentTab === "대학" ? "flex" : "none" }} className="flex flex-1 flex-col">
        <UniversityContent universities={universities} />
      </div>
    </div>
  );
}
