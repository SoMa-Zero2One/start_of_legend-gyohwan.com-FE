"use client";

import { useEffect, useState, useRef } from "react";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CommunityTabs from "./CommunityTabs";
import HeaderAuthSection from "@/components/layout/HeaderAuthSection";
import { fetchCountries, fetchUniversities } from "@/lib/api/community";
import { handleApiError } from "@/lib/utils/apiError";
import { enrichUniversityData } from "@/lib/utils/universityTransform";
import { enrichCountryData } from "@/lib/utils/countryTransform";
import { getCachedData, setCachedData } from "@/lib/utils/sessionCache";
import type { EnrichedCountry, EnrichedUniversity } from "@/types/community";
import type { CountryApiResponse, UniversityApiResponse } from "@/types/community";

/**
 * Community 페이지 클라이언트 컴포넌트
 *
 * Client-side Fetching 패턴:
 * - 컴포넌트 마운트 시 fetchUniversities() 호출
 * - credentials: "include"로 쿠키 포함 → 정확한 isFavorite 값 수신
 * - 즐겨찾기 추가/제거 후 refetch로 즉시 UI 반영
 *
 * 장점:
 * - 로그인 유저의 즐겨찾기 정보 정확히 표시
 * - 즐겨찾기 토글 후 즉시 반영
 * - 코드 단순화 (서버/클라이언트 분리 불필요)
 */
export default function CommunityClient() {
  const [countries, setCountries] = useState<EnrichedCountry[]>([]);
  const [universities, setUniversities] = useState<EnrichedUniversity[]>([]);
  const [isCountryLoading, setIsCountryLoading] = useState(true);
  const [isUniversityLoading, setIsUniversityLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(50);

  useEffect(() => {
    // Country 데이터 로드 (Stale-While-Revalidate 패턴)
    const loadCountries = async () => {
      // 1. 캐시에서 즉시 로드 (있으면 0.1초 만에 렌더링)
      const cachedCountries = getCachedData<CountryApiResponse[]>("COUNTRIES");
      if (cachedCountries) {
        setCountries(enrichCountryData(cachedCountries));
        setIsCountryLoading(false);
      }

      // 2. 백그라운드에서 최신 데이터 fetch & 업데이트
      try {
        const freshCountries = await fetchCountries();
        setCountries(enrichCountryData(freshCountries));
        setCachedData("COUNTRIES", freshCountries); // 캐시 갱신
      } catch (error) {
        console.error("[CommunityClient] Country 데이터 로드 실패:", error);
        // 캐시 데이터가 없는 경우에만 에러 표시
        if (!cachedCountries) {
          const errorMessage = handleApiError(error);
          setError(errorMessage);
        }
      } finally {
        setIsCountryLoading(false);
      }
    };

    // University 데이터 로드 (Stale-While-Revalidate 패턴)
    const loadUniversities = async () => {
      // 1. 캐시에서 즉시 로드
      const cachedUniversities = getCachedData<UniversityApiResponse[]>("UNIVERSITIES");
      if (cachedUniversities) {
        setUniversities(enrichUniversityData(cachedUniversities));
        setIsUniversityLoading(false);
      }

      // 2. 백그라운드에서 최신 데이터 fetch & 업데이트
      try {
        const freshUniversities = await fetchUniversities();
        setUniversities(enrichUniversityData(freshUniversities));
        setCachedData("UNIVERSITIES", freshUniversities); // 캐시 갱신
      } catch (error) {
        console.error("[CommunityClient] University 데이터 로드 실패:", error);
        // University 로드 실패는 Country 표시에 영향 없음 (조용히 실패)
      } finally {
        setIsUniversityLoading(false);
      }
    };

    // 병렬 실행하되, Country가 먼저 완료되면 즉시 렌더링
    loadCountries();
    loadUniversities();
  }, []);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) {
      return;
    }

    const updateHeight = () => {
      setHeaderHeight(element.getBoundingClientRect().height || 50);
    };

    updateHeight();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateHeight);
      observer.observe(element);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // 에러 발생
  if (error) {
    return (
      <>
        <div className="flex min-h-screen flex-col">
          <div ref={headerRef} className="sticky top-0 z-20 bg-white">
            <Header title="커뮤니티" showPrevButton showHomeButton showBorder>
              <HeaderAuthSection />
            </Header>
          </div>
          <div className="flex flex-1 items-center justify-center px-[20px] py-[60px]">
            <div className="text-center">
              <p className="body-2 text-gray-700">{error}</p>
              <p className="caption-2 mt-[8px] text-gray-500">잠시 후 다시 시도해주세요.</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // 정상 렌더링 (Country가 먼저 로드되면 즉시 표시, University는 백그라운드 로딩)
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div ref={headerRef} className="sticky top-0 z-20 bg-white">
          <Header title="커뮤니티" showPrevButton showHomeButton>
            <HeaderAuthSection />
          </Header>
        </div>
        <Suspense fallback={<div className="p-[20px]">Loading...</div>}>
          <CommunityTabs
            countries={countries}
            universities={universities}
            headerHeight={headerHeight}
            isCountryLoading={isCountryLoading}
            isUniversityLoading={isUniversityLoading}
          />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
