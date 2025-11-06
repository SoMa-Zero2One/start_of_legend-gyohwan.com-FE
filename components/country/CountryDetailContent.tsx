"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import CountryFlag from "@/components/common/CountryFlag";
import Tabs from "@/components/common/Tabs";
import UniversityList from "./UniversityList";
import type { CountryDetailResponse } from "@/types/country";
import ChevronRightIcon from "../icons/ChevronRightIcon";

interface CountryDetailContentProps {
  countryData: CountryDetailResponse;
}

type TabType = "대학 목록" | "커뮤니티";

const PREVIEW_UNIVERSITY_COUNT = 5;

export default function CountryDetailContent({ countryData }: CountryDetailContentProps) {
  const universityRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);

  const tabs: readonly TabType[] = ["대학 목록", "커뮤니티"] as const;
  const [selectedTab, setSelectedTab] = useState<TabType>("대학 목록");

  // 미리보기 대학 목록 및 더보기 버튼 표시 여부
  const previewUniversities = countryData.universities.slice(0, PREVIEW_UNIVERSITY_COUNT);
  const hasMoreUniversities = countryData.universities.length > PREVIEW_UNIVERSITY_COUNT;

  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);

    // 탭 변경 시 해당 섹션으로 스크롤
    if (tab === "대학 목록" && universityRef.current) {
      universityRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (tab === "커뮤니티" && communityRef.current) {
      communityRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* 국기 + 국가명 */}
      <div className="sticky top-[50px] z-10 flex flex-col gap-[20px] bg-white p-[20px]">
        <div className="flex items-center gap-[12px]">
          <CountryFlag country={countryData.name} size={40} />
          <h1 className="head-4">{countryData.name}</h1>
        </div>
        <Tabs tabs={tabs} selectedTab={selectedTab} onTabChange={handleTabChange} />
      </div>

      {/* 대학 목록 섹션 */}
      <div
        ref={universityRef}
        className="flex min-h-[60vh] scroll-mt-[182px] flex-col justify-between border-b-[1px] border-gray-300"
      >
        <UniversityList universities={previewUniversities} />
        {hasMoreUniversities && (
          <Link
            href={`/community/country/${countryData.countryCode}/universities`}
            className="medium-body-2 group flex w-full cursor-pointer items-center justify-center gap-[4px] py-[20px] text-gray-700 transition-colors hover:text-black hover:underline"
          >
            대학 더 보기
            <ChevronRightIcon size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {/* 커뮤니티 섹션 */}
      <div ref={communityRef} className="min-h-[50vh] scroll-mt-[182px] px-[20px] py-[24px]">
        <h2 className="mb-[16px] text-[24px] font-bold">커뮤니티</h2>
        <p className="body-2 text-gray-600">커뮤니티 기능은 추후 추가될 예정입니다.</p>
      </div>
    </div>
  );
}
