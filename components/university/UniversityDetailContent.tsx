"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import Tabs from "@/components/common/Tabs";
import CommunityPostList from "@/components/country/CommunityPostList";
import UniversityMap from "./UniversityMap";
import type { UniversityDetailResponse } from "@/types/university";
import type { CommunityPost } from "@/types/communityPost";
import ChevronRightIcon from "../icons/ChevronRightIcon";

interface UniversityDetailContentProps {
  universityData: UniversityDetailResponse;
  communityPosts: CommunityPost[];
}

type TabType = "위치" | "커뮤니티";

const PREVIEW_POST_COUNT = 5;

/**
 * USAGE: 대학 상세 페이지에서 사용
 *
 * WHAT: 대학 정보 + 위치(지도) + 커뮤니티 탭 표시
 *
 * WHY:
 * - CountryDetailContent와 동일한 UX 패턴
 * - 탭으로 정보 구분 (위치/커뮤니티)
 * - 방어적 코딩 (null 처리)
 *
 * ALTERNATIVES:
 * - 한 페이지에 모두 표시 (rejected: 정보 과다, 스크롤 길어짐)
 */
export default function UniversityDetailContent({ universityData, communityPosts }: UniversityDetailContentProps) {
  const locationRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const stickyTitleRef = useRef<HTMLDivElement>(null);

  const tabs: readonly TabType[] = ["위치", "커뮤니티"] as const;
  const [selectedTab, setSelectedTab] = useState<TabType>("위치");

  // 방어적 기본값
  const universityName = universityData.name ?? `University #${universityData.univId}`;

  // 미리보기 커뮤니티 게시글 (최대 5개)
  const previewPosts = communityPosts.slice(0, PREVIEW_POST_COUNT);

  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);

    // Page Header(50px) + Sticky Title의 실제 높이 계산
    const pageHeaderHeight = 50;
    const stickyTitleHeight = stickyTitleRef.current?.offsetHeight ?? 0;
    const totalOffset = pageHeaderHeight + stickyTitleHeight;

    // 탭 변경 시 해당 섹션으로 스크롤 (동적 offset 적용)
    if (tab === "위치" && locationRef.current) {
      const elementPosition = locationRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - totalOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else if (tab === "커뮤니티" && communityRef.current) {
      const elementPosition = communityRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - totalOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col pb-[60px]">
      {/* 대학 로고 + 대학명 */}
      <div ref={stickyTitleRef} className="sticky top-[50px] z-10 flex flex-col gap-[20px] bg-white p-[20px]">
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[12px]">
            <SchoolLogoWithFallback
              src={universityData.logoUrl}
              alt={universityName}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex flex-col gap-[4px]">
              <h1 className="head-4">{universityName}</h1>
              {universityData.countryName && (
                <p className="body-2 text-gray-700">
                  {universityData.countryName}
                  {universityData.countryCode && ` (${universityData.countryCode})`}
                </p>
              )}
            </div>
          </div>
        </div>
        <Tabs tabs={tabs} selectedTab={selectedTab} onTabChange={handleTabChange} />
      </div>

      {/* 위치 섹션 */}
      <div ref={locationRef} className="flex flex-col border-b-[1px] border-gray-300">
        <h2 className="head-4 px-[20px] pb-[16px]">위치</h2>
        <div className="px-[20px] pb-[20px]">
          <UniversityMap universityName={universityName} countryName={universityData.countryName} />
        </div>
      </div>

      {/* 커뮤니티 섹션 */}
      <div ref={communityRef} className="flex min-h-[60vh] flex-col">
        <CommunityPostList posts={previewPosts} />
        {/* 항상 커뮤니티 더 보기 표시 (글쓰기 등 전체 커뮤니티 기능 접근) */}
        <Link
          href={`/community/university/${universityData.univId}/talks`}
          className="medium-body-2 flex w-full cursor-pointer items-center justify-center gap-[4px] border-t border-gray-200 py-[20px] text-gray-700 transition-colors hover:text-black hover:underline"
        >
          커뮤니티 더 보기
          <ChevronRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}
