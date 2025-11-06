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

  useEffect(() => {
    // cleanup 시점에 이 effect가 여전히 유효한지 추적하는 플래그
    // (로그아웃하거나 컴포넌트가 unmount되면 false로 변경됨)
    let isMounted = true;

    if (isLoggedIn && !hasFetchedRef.current) {
      // === 로그인 상태: 즐겨찾기 정보 fetch ===
      fetchUniversities()
        .then((data) => {
          // ✅ fetch 완료 시점에 여전히 이 effect가 유효한지 확인
          // (로그아웃했거나 unmount된 경우 업데이트 방지)
          if (isMounted) {
            setUniversities(enrichUniversityData(data)); // isFavorite 업데이트
            hasFetchedRef.current = true; // ✅ 성공 후에만 플래그 설정
          }
        })
        .catch((err) => {
          console.error("[CommunityClient] 즐겨찾기 정보 로드 실패:", err);
          // hasFetchedRef.current는 false 그대로 유지 → 새로고침 시 재시도 가능
        });
    } else if (!isLoggedIn && hasFetchedRef.current) {
      // === 로그아웃 상태: 공개 데이터로 복원 ===
      // 다음 로그인 시 다시 fetch할 수 있도록 플래그 리셋
      hasFetchedRef.current = false;
      // 즐겨찾기 정보 제거 (isFavorite=false인 초기 데이터로 복원)
      setUniversities(enrichUniversityData(initialUniversities));
    }

    // cleanup: isLoggedIn이 변경되거나 컴포넌트가 unmount될 때 실행
    return () => {
      isMounted = false; // 진행 중인 fetch의 setState 방지
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]); // initialUniversities는 서버에서 한 번만 전달되므로 의도적으로 제외

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
