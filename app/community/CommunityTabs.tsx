"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 URL의 tab query parameter를 읽어서 현재 탭 결정
  const currentTab: TabType = searchParams.get("tab") === "대학" ? "대학" : "나라";

  const handleTabChange = (tab: TabType) => {
    router.replace(`/community?tab=${tab}`);
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
