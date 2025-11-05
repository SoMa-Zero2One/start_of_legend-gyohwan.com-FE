"use client";

import { useState, useMemo } from "react";
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

interface UniversityContentProps {
  universities: EnrichedUniversity[];
}

// 클라이언트 컴포넌트 (인터랙션 처리)
export default function UniversityContent({ universities }: UniversityContentProps) {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localUniversities, setLocalUniversities] = useState(universities);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const { errorMessage, isExiting, showError, hideToast } = useToast();

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
    } catch {
      // 실패 시 롤백
      setLocalUniversities((prev) =>
        prev.map((univ) => (univ.univId === univId ? { ...univ, isFavorite: prevState } : univ))
      );
      showError("즐겨찾기 처리에 실패했습니다");
    }
  };

  // 즐겨찾기 필터링된 대학 목록
  const displayedUniversities = useMemo(() => {
    if (!showFavoritesOnly) return sortedUniversities;
    return sortedUniversities.filter((univ) => univ.isFavorite);
  }, [sortedUniversities, showFavoritesOnly]);

  // 비로그인 + 즐겨찾기 토글 ON → CTA 표시
  const shouldShowLoginCTA = !isLoggedIn && showFavoritesOnly;

  const handleLoginClick = () => {
    router.push("/log-in-or-create-account");
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* 전체 개수 + 필터 버튼 */}
      <div className="flex items-center justify-between px-[20px] py-4">
        <h2 className="subhead-1">전체 ({displayedUniversities.length})</h2>
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
          universities={displayedUniversities}
          visibleFieldKeys={visibleFieldKeys}
          isLoggedIn={isLoggedIn}
          onSort={handleSort}
          sortConfig={sortConfig}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}

      {/* Toast */}
      <Toast message={errorMessage} isExiting={isExiting} onClose={hideToast} />

      {/* 하단 고정 즐겨찾기 필터 토글 */}
      <FavoriteFilterToggle checked={showFavoritesOnly} onChange={setShowFavoritesOnly} />

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
