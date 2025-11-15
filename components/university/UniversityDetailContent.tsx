"use client";

import { useRef, useState } from "react";
import Markdown from "react-markdown";
// import Link from "next/link";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import Tabs from "@/components/common/Tabs";
import CommunityPostList from "@/components/country/CommunityPostList";
// import UniversityMap from "./UniversityMap";
import type { UniversityDetailResponse } from "@/types/university";
import type { CommunityPost } from "@/types/communityPost";
// import ChevronRightIcon from "../icons/ChevronRightIcon";

interface UniversityDetailContentProps {
  universityData: UniversityDetailResponse;
  communityPosts: CommunityPost[];
}

type TabType = "대학 정보" | "커뮤니티";

const PREVIEW_POST_COUNT = 5;

/**
 * USAGE: 대학 상세 페이지에서 사용
 *
 * WHAT: 대학 정보(markdown) + 커뮤니티 탭 표시 (display 전환 방식)
 *
 * WHY:
 * - API에서 information(markdown) 필드를 받아 표시
 * - 탭 클릭 시 display만 전환 (community page와 동일한 UX)
 * - 스크롤 동기화 제거로 복잡도 감소
 * - 방어적 코딩 (null 처리)
 *
 * ALTERNATIVES:
 * - 스크롤 동기화 방식 (rejected: 복잡하고 유지보수 어려움)
 * - 한 페이지에 모두 표시 (rejected: 정보 과다)
 */
export default function UniversityDetailContent({ universityData, communityPosts }: UniversityDetailContentProps) {
  const stickyTitleRef = useRef<HTMLDivElement>(null);

  const tabs: readonly TabType[] = ["대학 정보", "커뮤니티"] as const;
  const [selectedTab, setSelectedTab] = useState<TabType>("대학 정보");

  // 방어적 기본값
  const universityName = universityData.name ?? `University #${universityData.univId}`;

  // 스크롤 동기화 로직 제거 (주석 처리)
  // useEffect(() => {
  //   const handleScrollSpy = () => {
  //     if (!informationRef.current || !communityRef.current) {
  //       return;
  //     }

  //     const pageHeaderHeight = 50;
  //     const stickyTitleHeight = stickyTitleRef.current?.offsetHeight ?? 0;
  //     const totalOffset = pageHeaderHeight + stickyTitleHeight;

  //     const scrollPosition = window.scrollY + totalOffset + 1;

  //     const getAbsoluteTop = (element: HTMLDivElement) => element.getBoundingClientRect().top + window.scrollY;

  //     const communityTop = getAbsoluteTop(communityRef.current);

  //     const activeTab: TabType = scrollPosition >= communityTop ? "커뮤니티" : "대학 정보";

  //     setSelectedTab((prev) => (prev === activeTab ? prev : activeTab));
  //   };

  //   window.addEventListener("scroll", handleScrollSpy, { passive: true });
  //   handleScrollSpy();

  //   return () => {
  //     window.removeEventListener("scroll", handleScrollSpy);
  //   };
  // }, []);

  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
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

      {/* 대학 정보 섹션 */}
      <div style={{ display: selectedTab === "대학 정보" ? "block" : "none" }}>
        <div className="flex flex-col border-b-[1px] border-gray-300 px-[20px] pt-[20px] pb-[20px]">
          {universityData.information ? (
            <Markdown
              components={{
                h1: ({ children }) => <h1 className="head-3 mt-[20px] mb-[12px] first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="head-4 mt-[16px] mb-[8px] first:mt-0">{children}</h2>,
                h3: ({ children }) => <h3 className="medium-body-1 mt-[12px] mb-[8px] first:mt-0">{children}</h3>,
                p: ({ children }) => <p className="body-2 mb-[12px] leading-relaxed text-gray-900 whitespace-pre-line">{children}</p>,
                ul: ({ children }) => <ul className="mb-[12px] ml-[20px] list-disc space-y-[4px]">{children}</ul>,
                ol: ({ children }) => <ol className="mb-[12px] ml-[20px] list-decimal space-y-[4px]">{children}</ol>,
                li: ({ children }) => <li className="body-2 text-gray-900 whitespace-pre-line">{children}</li>,
                strong: ({ children }) => <strong className="medium-body-2 text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="text-gray-800 italic">{children}</em>,
                a: ({ children, href }) => (
                  <a href={href} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-[16px] text-gray-700 italic whitespace-pre-line">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="rounded-[4px] bg-gray-100 px-[6px] py-[2px] text-sm text-gray-800">{children}</code>
                ),
                br: () => <br className="my-[8px]" />,
              }}
            >
              {universityData.information}
            </Markdown>
          ) : (
            <p className="body-2 text-gray-500">대학 정보가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 커뮤니티 섹션 */}
      <div style={{ display: selectedTab === "커뮤니티" ? "block" : "none" }}>
        <div className="flex min-h-[60vh] flex-col">
          <CommunityPostList posts={communityPosts} outgoingUnivId={universityData.univId} />
        </div>
      </div>

      {/* 위치 섹션 (주석 처리) */}
      {/* <div ref={locationRef} className="flex flex-col border-b-[1px] border-gray-300">
        <h2 className="head-4 px-[20px] pb-[16px]">위치</h2>
        <div className="px-[20px] pb-[20px]">
          <UniversityMap universityName={universityName} countryName={universityData.countryName} />
        </div>
      </div> */}
    </div>
  );
}
