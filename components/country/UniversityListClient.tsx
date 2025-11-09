"use client";

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import UniversityListItem from "@/components/country/UniversityListItem";
import type { UniversitySimple } from "@/types/country";

interface UniversityListClientProps {
  countryName: string;
  universities: UniversitySimple[];
}

/**
 * USAGE: /community/country/[code]/universities 페이지의 클라이언트 컴포넌트
 *
 * WHAT: Header 검색 기능과 대학 목록 필터링을 담당
 *
 * WHY:
 * - Header 검색은 클라이언트 상태 필요 (useState)
 * - 서버 컴포넌트에서 데이터 fetch → SEO 최적화
 * - 클라이언트에서 검색만 처리 → 즉각적인 반응
 *
 * ALTERNATIVES:
 * - 전체를 클라이언트 컴포넌트로 (rejected: SEO 불리, 초기 로딩 느림)
 */
export default function UniversityListClient({
  countryName,
  universities,
}: UniversityListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // 검색 필터링 (한글/영문 부분 일치, 대소문자 무시)
  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return universities;

    const query = searchQuery.toLowerCase().trim();
    return universities.filter((university) => {
      const nameKo = university.nameKo ?? "";
      const nameEn = university.nameEn ?? "";
      return nameKo.toLowerCase().includes(query) || nameEn.toLowerCase().includes(query);
    });
  }, [universities, searchQuery]);

  return (
    <>
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white">
        <Header
          title={`${countryName} 대학 목록`}
          showPrevButton
          showHomeButton
          showSearchButton
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <main className="mx-auto w-full max-w-[430px] flex-1">
        {/* 개수 표시 */}
        <div className="px-[20px] py-[16px]">
          <h2 className="head-4">전체 ({filteredUniversities.length})</h2>
        </div>

        {/* 대학 리스트 */}
        {filteredUniversities.length > 0 ? (
          <div className="flex flex-col gap-[8px] px-[20px] pb-[40px]">
            {filteredUniversities.map((university) => (
              <UniversityListItem key={university.univId} {...university} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-[60px]">
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}
      </main>
    </>
  );
}
