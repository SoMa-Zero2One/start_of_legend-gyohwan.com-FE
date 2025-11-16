"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CommunityTabs from "./CommunityTabs";
import { fetchUniversities } from "@/lib/api/community";
import { enrichUniversityData } from "@/lib/utils/universityTransform";
import type { EnrichedUniversity } from "@/types/community";

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
  const [universities, setUniversities] = useState<EnrichedUniversity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 대학 목록 fetch (쿠키 포함)
    fetchUniversities()
      .then((data) => {
        if (isMounted) {
          setUniversities(enrichUniversityData(data));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("[CommunityClient] 대학 목록 로드 실패:", err);
        if (isMounted) {
          setError("데이터를 불러오는데 실패했습니다.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 로딩 중
  if (isLoading) {
    return (
      <>
        <div className="flex min-h-screen flex-col">
          <Header title="커뮤니티" showPrevButton showHomeButton />
          <div className="flex flex-1 items-center justify-center px-[20px] py-[60px]">
            <p className="body-2 text-gray-500">로딩 중...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <>
        <div className="flex min-h-screen flex-col">
          <Header title="커뮤니티" showPrevButton showHomeButton />
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

  // 정상 렌더링
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header title="커뮤니티" showPrevButton showHomeButton />
        <Suspense fallback={<div className="p-[20px]">Loading...</div>}>
          <CommunityTabs countries={[]} universities={universities} />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
