"use client";

import { useEffect, useRef, useState } from "react";
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
const PREVIEW_POST_COUNT = 5;

export default function CountryDetailContent({ countryData, communityPosts }: CountryDetailContentProps) {
  const universityRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const stickyTitleRef = useRef<HTMLDivElement>(null);

  const tabs: readonly TabType[] = ["대학 목록", "커뮤니티"] as const;
  const [selectedTab, setSelectedTab] = useState<TabType>("대학 목록");

  // 방어적 기본값
  const universities = countryData.universities ?? [];
  // name이 null이면 countryCode를 대신 표시 (최소한 어떤 국가인지 식별 가능)
  const countryName = countryData.name ?? countryData.countryCode.toUpperCase();

  // 미리보기 대학 목록 및 더보기 버튼 표시 여부
  const previewUniversities = universities.slice(0, PREVIEW_UNIVERSITY_COUNT);
  const hasMoreUniversities = universities.length > PREVIEW_UNIVERSITY_COUNT;

  // 미리보기 커뮤니티 게시글 (최대 5개)
  const previewPosts = communityPosts.slice(0, PREVIEW_POST_COUNT);

  useEffect(() => {
    if (!communityRef.current) {
      return;
    }

    const pageHeaderHeight = 50;
    const stickyTitleHeight = stickyTitleRef.current?.offsetHeight ?? 0;
    const totalOffset = pageHeaderHeight + stickyTitleHeight;

    const elementPosition = communityRef.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - totalOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const handleScrollSpy = () => {
      if (!universityRef.current || !communityRef.current) {
        return;
      }

      const pageHeaderHeight = 50;
      const stickyTitleHeight = stickyTitleRef.current?.offsetHeight ?? 0;
      const totalOffset = pageHeaderHeight + stickyTitleHeight;

      const scrollPosition = window.scrollY + totalOffset + 1;

      const getAbsoluteTop = (element: HTMLDivElement) => element.getBoundingClientRect().top + window.scrollY;

      const COMMUNITY_ACTIVATE_OFFSET = 120;
      const communityTop = getAbsoluteTop(communityRef.current) - COMMUNITY_ACTIVATE_OFFSET;

      const activeTab: TabType = scrollPosition >= communityTop ? "커뮤니티" : "대학 목록";

      setSelectedTab((prev) => (prev === activeTab ? prev : activeTab));
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();

    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
    };
  }, []);

  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);

    // Page Header(50px) + Sticky Title의 실제 높이 계산
    const pageHeaderHeight = 50;
    const stickyTitleHeight = stickyTitleRef.current?.offsetHeight ?? 0;
    const totalOffset = pageHeaderHeight + stickyTitleHeight;

    // 탭 변경 시 해당 섹션으로 스크롤 (동적 offset 적용)
    if (tab === "대학 목록" && universityRef.current) {
      const elementPosition = universityRef.current.getBoundingClientRect().top;
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
      {/* 국기 + 국가명 */}
      <div ref={stickyTitleRef} className="sticky top-[50px] z-10 flex flex-col gap-[20px] bg-white p-[20px]">
        <div className="flex items-center gap-[12px]">
          <CountryFlag country={countryName} size={40} />
          <h1 className="head-4">{countryName}</h1>
        </div>
        <Tabs tabs={tabs} selectedTab={selectedTab} onTabChange={handleTabChange} />
      </div>

      {/* 대학 목록 섹션 */}
      <div ref={universityRef} className="flex min-h-[60vh] flex-col border-b-[1px] border-gray-300">
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

      {/* 커뮤니티 섹션 */}
      <div ref={communityRef} className="flex min-h-[60vh] flex-col">
        <CommunityPostList posts={previewPosts} countryCode={countryData.countryCode} />
        <Link
          href={`/community/country/${countryData.countryCode}/talks`}
          className="medium-body-2 flex w-full cursor-pointer items-center justify-center gap-[4px] border-t border-gray-300 py-[20px] text-gray-700 transition-colors hover:text-black hover:underline"
        >
          커뮤니티 바로가기
          <ChevronRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}
