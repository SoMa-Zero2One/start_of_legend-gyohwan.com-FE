"use client";

import { useState } from "react";
import Link from "next/link";
import CountryFlag from "@/components/common/CountryFlag";
import Tabs from "@/components/common/Tabs";
import UniversityList from "./UniversityList";
import CommunityPostList from "./CommunityPostList";
import type { CountryDetailResponse } from "@/types/country";
import type { CommunityPost } from "@/types/communityPost";
import ChevronRightIcon from "../icons/ChevronRightIcon";

interface CountryDetailContentProps {
  countryData: CountryDetailResponse;
  communityPosts: CommunityPost[];
}

type TabType = "대학 목록" | "커뮤니티";

const PREVIEW_UNIVERSITY_COUNT = 5;

export default function CountryDetailContent({ countryData, communityPosts }: CountryDetailContentProps) {
  const tabs: readonly TabType[] = ["커뮤니티", "대학 목록"] as const;
  const [selectedTab, setSelectedTab] = useState<TabType>("커뮤니티");

  // 방어적 기본값
  const universities = countryData.universities ?? [];
  // name이 null이면 countryCode를 대신 표시 (최소한 어떤 국가인지 식별 가능)
  const countryName = countryData.name ?? countryData.countryCode.toUpperCase();

  // 미리보기 대학 목록 및 더보기 버튼 표시 여부
  const previewUniversities = universities.slice(0, PREVIEW_UNIVERSITY_COUNT);
  const hasMoreUniversities = universities.length > PREVIEW_UNIVERSITY_COUNT;

  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex min-h-screen flex-col pb-[60px]">
      {/* 국기 + 국가명 */}
      <div className="sticky top-[50px] z-10 flex flex-col gap-[20px] bg-white p-[20px]">
        <div className="flex items-center gap-[12px]">
          <CountryFlag country={countryName} size={40} />
          <h1 className="head-4">{countryName}</h1>
        </div>
        <Tabs tabs={tabs} selectedTab={selectedTab} onTabChange={handleTabChange} />
      </div>

      {selectedTab === "커뮤니티" ? (
        <div className="flex min-h-[60vh] flex-col">
          <CommunityPostList posts={communityPosts} countryCode={countryData.countryCode} />
        </div>
      ) : (
        <div className="flex min-h-[60vh] flex-col border-b-[1px] border-gray-300">
          <UniversityList universities={previewUniversities} />
          {hasMoreUniversities && (
            <Link
              href={`/community/country/${countryData.countryCode}/universities`}
              className="medium-body-2 mt-[4px] flex w-full cursor-pointer items-center justify-center gap-[4px] py-[20px] text-gray-700 transition-colors hover:text-black hover:underline"
            >
              대학 더 보기
              <ChevronRightIcon size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
