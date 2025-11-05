"use client";

import { useEffect, useState, useRef } from "react";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CommunityTabs from "./CommunityTabs";
import { useAuthStore } from "@/stores/authStore";
import { fetchUniversities } from "@/lib/api/community";
import { enrichCountryData } from "@/lib/utils/countryTransform";
import { enrichUniversityData } from "@/lib/utils/universityTransform";
import type { CountryApiResponse, UniversityApiResponse } from "@/types/community";

interface CommunityClientProps {
  initialCountries: CountryApiResponse[];
  initialUniversities: UniversityApiResponse[];
}

/**
 * Community 페이지 클라이언트 컴포넌트
 *
 * SEO 최적화를 위한 Client Hydration 패턴:
 * 1. 서버: fetchUniversitiesPublic으로 초기 데이터 렌더링 (SEO용, isFavorite=false)
 * 2. 클라이언트: 로그인 유저만 fetchUniversities로 즐겨찾기 정보 hydrate
 *
 * 장점:
 * - 검색 엔진이 전체 대학 목록을 인덱싱 가능
 * - 로그인 유저는 즐겨찾기 정보 표시
 * - 초기 렌더링 빠름 (hydration은 백그라운드)
 */
export default function CommunityClient({ initialCountries, initialUniversities }: CommunityClientProps) {
  // 서버 데이터로 초기화
  const [countries] = useState(() => enrichCountryData(initialCountries));
  const [universities, setUniversities] = useState(() => enrichUniversityData(initialUniversities));
  const { isLoggedIn } = useAuthStore();
  const hasFetchedRef = useRef(false);

  // 로그인 상태면 즐겨찾기 정보 포함된 데이터로 hydrate (정확히 1번만 실행)
  useEffect(() => {
    if (isLoggedIn && !hasFetchedRef.current) {
      hasFetchedRef.current = true;

      fetchUniversities()
        .then((data) => {
          setUniversities(enrichUniversityData(data)); // isFavorite 업데이트
        })
        .catch((err) => {
          console.error("[CommunityClient] 즐겨찾기 정보 로드 실패:", err);
          // 실패 시 재시도 가능하도록 플래그 리셋
          hasFetchedRef.current = false;
        });
    }
  }, [isLoggedIn]);

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header title="커뮤니티" showPrevButton showHomeButton />
        <Suspense fallback={<div className="p-[20px]">Loading...</div>}>
          <CommunityTabs countries={countries} universities={universities} />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
