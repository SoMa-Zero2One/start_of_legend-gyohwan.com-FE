"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import UniversityTable from "@/components/community/UniversityTable";
import UniversityFilterModal from "@/components/community/UniversityFilterModal";
import FavoriteFilterToggle from "@/components/community/FavoriteFilterToggle";
import FilterIcon from "@/components/icons/FilterIcon";
import Toast from "@/components/common/Toast";
import { EnrichedUniversity, Continent } from "@/types/community";
import { useUniversityTable } from "@/hooks/useUniversityTable";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/useToast";
import { addFavorite, removeFavorite } from "@/lib/api/community";
import { handleApiError } from "@/lib/utils/apiError";
import { saveRedirectUrl } from "@/lib/utils/redirect";

interface UniversityContentProps {
  universities: EnrichedUniversity[];
}

const UNIVERSITY_LOAD_CHUNK = 30;

// 클라이언트 컴포넌트 (인터랙션 처리)
export default function UniversityContent({ universities }: UniversityContentProps) {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localUniversities, setLocalUniversities] = useState(universities);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFilledOnly, setShowFilledOnly] = useState(true);
  const [visibleCount, setVisibleCount] = useState(UNIVERSITY_LOAD_CHUNK);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { isLoggedIn } = useAuthStore();
  const { message, messageType, isExiting, showMessage, hideToast } = useToast();

  // 커스텀 훅으로 정렬/필터 관리
  const {
    sortedUniversities,
    sortConfig,
    handleSort,
    visibleFieldKeys,
    setVisibleFieldKeys,
    selectedCountries,
    setSelectedCountries,
    activeContinents,
    setActiveContinents,
  } = useUniversityTable(localUniversities);

  // 필터 적용 핸들러
  const handleApplyFilter = (countries: string[], fieldKeys: string[], continents: Continent[]) => {
    setSelectedCountries(countries);
    setVisibleFieldKeys(fieldKeys);
    setActiveContinents(continents);
  };

  // 즐겨찾기 토글 핸들러 (Optimistic Update)
  const handleFavoriteToggle = async (univId: number, currentState: boolean) => {
    const prevState = currentState;

    // 즉시 UI 업데이트 (Optimistic Update)
    setLocalUniversities((prev) =>
      prev.map((univ) => (univ.univId === univId ? { ...univ, isFavorite: !prevState } : univ))
    );

    try {
      // API 호출
      if (prevState) {
        await removeFavorite(univId);
      } else {
        await addFavorite(univId);
      }
    } catch (error) {
      // 실패 시 롤백
      setLocalUniversities((prev) =>
        prev.map((univ) => (univ.univId === univId ? { ...univ, isFavorite: prevState } : univ))
      );
      const errorMessage = handleApiError(error);
      showMessage(errorMessage, "error");
    }
  };

  // 즐겨찾기 필터링된 대학 목록
  const favoritedUniversities = useMemo(() => {
    if (!showFavoritesOnly) return sortedUniversities;
    return sortedUniversities.filter((univ) => univ.isFavorite);
  }, [sortedUniversities, showFavoritesOnly]);

  // showFilledOnly가 true면 나라를 제외한 모든 필드가 null인 대학 제외
  const displayedUniversities = useMemo(() => {
    if (!showFilledOnly) return favoritedUniversities;
    return favoritedUniversities.filter((university) => university.isFilled);
  }, [favoritedUniversities, showFilledOnly]);

  const visibleUniversities = useMemo(() => {
    return displayedUniversities.slice(0, visibleCount);
  }, [displayedUniversities, visibleCount]);

  const hasMoreUniversities = visibleCount < displayedUniversities.length;

  useEffect(() => {
    // 필터 결과가 바뀌면 초기 페이지로 리셋
    setVisibleCount(Math.min(UNIVERSITY_LOAD_CHUNK, displayedUniversities.length || UNIVERSITY_LOAD_CHUNK));
  }, [displayedUniversities.length]);

  useEffect(() => {
    if (!hasMoreUniversities) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + UNIVERSITY_LOAD_CHUNK, displayedUniversities.length));
        }
      },
      { rootMargin: "120px 0px" }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
      observer.disconnect();
    };
  }, [hasMoreUniversities, displayedUniversities.length]);

  // 비로그인 + 즐겨찾기 토글 ON → CTA 표시
  const shouldShowLoginCTA = !isLoggedIn && showFavoritesOnly;

  const handleLoginClick = () => {
    const targetUrl = "/community?tab=대학";
    saveRedirectUrl(targetUrl);
    router.push("/log-in-or-create-account");
  };

  // 즐겨찾기 필터 토글 핸들러 (최상단으로 스크롤)
  const handleFavoriteFilterToggle = (checked: boolean) => {
    setShowFavoritesOnly(checked);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* 전체 개수 + 필터 버튼 */}
      <div className="flex items-center justify-between px-[20px] py-4">
        <div>
          <h2 className="subhead-1">전체 ({displayedUniversities.length})</h2>
          <p className="caption-2 mt-[4px] text-gray-700">행을 클릭하여 대학 상세 정보를 확인하세요</p>
        </div>
      </div>

      {/* 정보 입력된 항목만 보기 토글 */}
      <div className="flex items-center justify-between px-[20px] pb-4">
        <div className="flex items-center gap-[12px]">
          <button
            onClick={() => setShowFilledOnly(!showFilledOnly)}
            className={`relative h-[18px] w-[32px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
              showFilledOnly ? "bg-primary-blue" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15)] transition-transform duration-200 ${
                showFilledOnly ? "translate-x-[16px]" : "translate-x-[2px]"
              }`}
            />
          </button>
          <span className="medium-body-3">정보 입력된 항목만 보기</span>
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-primary-blue flex cursor-pointer items-center gap-[4px] rounded-md px-[10px] py-[6px] text-white"
        >
          <span className="caption-2">필터</span>
          <FilterIcon size={20} />
        </button>
      </div>

      {/* 대학 테이블 또는 로그인 CTA */}
      {shouldShowLoginCTA ? (
        <div className="flex flex-1 flex-col items-center justify-center px-[20px] py-[120px]">
          <div className="medium-body-2 flex w-full max-w-[350px] flex-1 flex-col items-center gap-[20px]">
            <div className="text-center">로그인 후 즐겨찾기 기능을 사용할 수 있습니다.</div>
            <button
              onClick={handleLoginClick}
              className="bg-primary-blue w-full cursor-pointer rounded-[8px] py-[16px] text-white shadow-[0_4px_12px_rgba(5,109,255,0.3)]"
            >
              로그인하고 즐겨찾기 사용하기 🌟
            </button>
          </div>
        </div>
      ) : (
        <UniversityTable
          universities={visibleUniversities}
          visibleFieldKeys={visibleFieldKeys}
          isLoggedIn={isLoggedIn}
          onSort={handleSort}
          sortConfig={sortConfig}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}

      {/* 무한 스크롤 센티널 */}
      {hasMoreUniversities && (
        <div ref={sentinelRef} className="flex justify-center px-[20px] py-6">
          <span className="caption-1 text-gray-500">불러오는 중...</span>
        </div>
      )}

      {/* Toast */}
      <Toast message={message} type={messageType} isExiting={isExiting} onClose={hideToast} />

      {/* 하단 고정 즐겨찾기 필터 토글 */}
      {!isFilterOpen && <FavoriteFilterToggle checked={showFavoritesOnly} onChange={handleFavoriteFilterToggle} />}

      {/* 필터 모달 */}
      <UniversityFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCountries={selectedCountries}
        visibleFieldKeys={visibleFieldKeys}
        activeContinents={activeContinents}
        onApply={handleApplyFilter}
        universities={universities}
      />
    </div>
  );
}
