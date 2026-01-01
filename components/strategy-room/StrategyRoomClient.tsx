"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import HeaderAuthSection from "@/components/layout/HeaderAuthSection";
import SearchHeaderDialog from "@/components/layout/SearchHeaderDialog";
import Footer from "@/components/layout/Footer";
import UniversitySlotCard from "@/components/strategy-room/UniversitySlotCard";
import StrategyRoomPageSkeleton from "@/components/strategy-room/StrategyRoomPageSkeleton";
import Tabs from "@/components/common/Tabs";
import ShareGradeCTA from "@/components/strategy-room/ShareGradeCTA";
import SearchIcon from "@/components/icons/SearchIcon";
import { useIsDesktop } from "@/lib/hooks/useMediaQuery";
import { getSeasonSlots, getMyApplication } from "@/lib/api/slot";
import { handleApiError } from "@/lib/utils/apiError";
import { trackEvent } from "@/lib/analytics/gtag";
import { SeasonSlotsResponse, MyApplicationResponse } from "@/types/slot";

const TAB_OPTIONS = ["지망한 대학", "지원자가 있는 대학", "모든 대학"] as const;
type TabType = (typeof TAB_OPTIONS)[number];

const getSafeOpenchatUrl = (raw?: string | null) => {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    if (url.hostname !== "open.kakao.com") return null;
    return url.toString();
  } catch {
    return null;
  }
};

export default function StrategyRoomClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tabFromUrl = TAB_OPTIONS.find((tab) => tab === tabParam) ?? null;
  const seasonId = params.seasonId as string;
  const isDesktop = useIsDesktop();

  const [data, setData] = useState<SeasonSlotsResponse | null>(null);
  const [myApplication, setMyApplication] = useState<MyApplicationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<TabType>(tabFromUrl ?? "모든 대학");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  // 탭 변경 핸들러 (URL 업데이트 포함)
  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/strategy-room/${seasonId}?${params.toString()}`, { scroll: false });
  };

  // API에서 받아온 성적 공유 여부
  const hasSharedGrade = data?.hasApplied ?? false;
  const safeOpenchatUrl = getSafeOpenchatUrl(data?.openchatUrl);
  const reselectCtaParams = {
    cta_id: "university_reselect_cta",
    cta_location: "grade_share_page",
    cta_label: "지원 대학교 변경",
    season_id: Number(seasonId),
    season_name: data?.seasonName,
  };

  // 내가 지원한 대학 목록 (slotId 배열)
  const myChosenUniversities = useMemo(() => {
    if (!myApplication) return [];
    return myApplication.choices.map((choice) => choice.slot.slotId);
  }, [myApplication]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [slotsResult, applicationResult] = await Promise.all([
          getSeasonSlots(parseInt(seasonId)),
          getMyApplication(parseInt(seasonId)).catch(() => null), // 지원서가 없을 수 있으므로 에러 무시
        ]);
        setData(slotsResult);
        setMyApplication(applicationResult);
      } catch (error) {
        console.error("Data fetch error:", error);
        const errorMessage = handleApiError(error);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (seasonId) {
      fetchData();
    }
  }, [seasonId]);

  const applicantSlotCount = useMemo(() => {
    if (!data) return 0;
    return data.slots.filter((slot) => slot.choiceCount !== null && slot.choiceCount >= 1).length;
  }, [data]);

  const hasApplicantSlots = applicantSlotCount > 0;

  // URL -> 성적 공유 여부 -> 지원자 수 순으로 초기 탭 결정
  useEffect(() => {
    if (tabFromUrl) {
      setSelectedTab(tabFromUrl);
      return;
    }

    if (data?.hasApplied) {
      setSelectedTab("지망한 대학");
      return;
    }

    if (hasApplicantSlots) {
      setSelectedTab("지원자가 있는 대학");
      return;
    }

    setSelectedTab("모든 대학");
  }, [tabFromUrl, data?.hasApplied, hasApplicantSlots]);

  // 필터링된 슬롯 목록 (탭 + 검색)
  const filteredSlots = useMemo(() => {
    if (!data) return [];

    // 1단계: 탭에 따른 필터링
    let slots = data.slots;

    if (selectedTab === "지원자가 있는 대학") {
      // null이 아니고 1 이상인 경우만 필터링 (null은 정보 없음이므로 제외)
      slots = data.slots.filter((slot) => slot.choiceCount !== null && slot.choiceCount >= 1);
    } else if (selectedTab === "지망한 대학") {
      slots = data.slots.filter((slot) => myChosenUniversities.includes(slot.slotId));
    }

    // 2단계: 검색어에 따른 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      slots = slots.filter((slot) => {
        const name = slot.name ?? "";
        const country = slot.country ?? "";
        return name.toLowerCase().includes(query) || country.toLowerCase().includes(query);
      });
    }

    return slots;
  }, [selectedTab, data, myChosenUniversities, searchQuery]);

  // "지망한 대학" 탭 + 미참여 시 blur 처리
  const shouldShowBlur = selectedTab === "지망한 대학" && !hasSharedGrade;

  // blur 배경용 슬롯 (지원자가 있는 대학)
  const backgroundSlots = useMemo(() => {
    if (!data) return [];
    // null이 아니고 1 이상인 경우만 필터링
    return data.slots.filter((slot) => slot.choiceCount !== null && slot.choiceCount >= 1);
  }, [data]);

  // CTA 버튼 클릭 핸들러
  // Layout에서 이미 로그인/학교인증을 체크하므로 직접 이동만 함
  const handleCTAClick = () => {
    router.push(`/strategy-room/${seasonId}/applications/new`);
  };

  if (isLoading) {
    return <StrategyRoomPageSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="실시간 경쟁률" showHomeButton showPrevButton showBorder />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-error-red">{error || "데이터를 찾을 수 없습니다."}</p>
        </div>
      </div>
    );
  }

  // seasonName 파싱: "인천대학교 2026-1 모집" -> "인천대학교", "26-1 학기"
  const seasonName = data.seasonName ?? "";
  const universityName = seasonName ? seasonName.split(" ")[0] : "";
  const match = seasonName.match(/(\d{4})-(\d)/);
  const parsedSemester = match ? `${match[1].slice(-2)}-${match[2]} 학기` : "";

  const tabCounts = {
    "지망한 대학": !hasSharedGrade ? 0 : myChosenUniversities.length,
    "지원자가 있는 대학": applicantSlotCount,
    "모든 대학": data.slots.length,
  };

  const renderDesktopSearch = () => (
    <div className="relative hidden w-full max-w-[260px] xl:block">
      <SearchIcon size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
      <input
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="대학명 또는 국가로 검색"
        className="body-3 w-full rounded-full border border-gray-300 bg-white py-[10px] pr-[16px] pl-[38px] transition outline-none focus:border-black"
      />
    </div>
  );

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header
          title={seasonName || "실시간 경쟁률"}
          showPrevButton
          showHomeButton
          showSearchButton
          onSearchClick={() => setIsSearchDialogOpen(true)}
        >
          {isDesktop && <HeaderAuthSection />}
        </Header>

        <SearchHeaderDialog
          isOpen={isSearchDialogOpen}
          value={searchQuery}
          onChange={setSearchQuery}
          onClose={() => {
            setIsSearchDialogOpen(false);
            setSearchQuery("");
          }}
          placeholder="대학명 또는 국가로 검색..."
        />

        <div className="flex w-full flex-1 flex-col gap-[24px] px-[20px] py-[24px] xl:gap-[32px] xl:py-[40px]">
          <section className="flex flex-col gap-[8px] xl:gap-[12px]">
            <p className="caption-1 xl:!text-[16px]">{parsedSemester}</p>
            <div className="flex flex-col gap-[12px] xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="head-4 text-[26px] xl:text-[36px]">{universityName} 교환학생</h1>
              </div>
              {hasSharedGrade && (
                <Link
                  href={`/strategy-room/${seasonId}/applications/re-select-university`}
                  onClick={() => trackEvent("cta_click", reselectCtaParams)}
                  className="body-3 flex items-center justify-center rounded-full border border-gray-200 px-[20px] py-[10px] font-semibold text-gray-900 hover:bg-gray-100"
                >
                  지원 대학교 변경
                </Link>
              )}
            </div>
            <div className="flex flex-col gap-[12px] xl:flex-row xl:items-center xl:gap-[12px]">
              {/* 성적 공유 참여 배지 */}
              <div className="relative inline-block w-fit overflow-hidden rounded-full bg-gradient-to-r from-[#056DFF] via-[#029EFA] to-[#00D0FF] p-[1px]">
                <span className="caption-2 text-primary-blue block rounded-full bg-[#E9F1FF] px-3 py-1">
                  🔥 총 {data.applicantCount}명 성적 공유 참여 중!
                </span>
              </div>

              {/* 오픈채팅방 버튼 */}
              {safeOpenchatUrl && (
                <a
                  href={safeOpenchatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="caption-2 inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#FFD75E] to-[#FFA84E] px-[20px] py-[10px] text-gray-900 xl:px-[24px] xl:py-[6px]"
                >
                  💬 {universityName} 교환학생 함께 준비하기
                </a>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-[12px] xl:flex-row xl:items-center xl:justify-between">
            <Tabs tabs={TAB_OPTIONS} selectedTab={selectedTab} onTabChange={handleTabChange} counts={tabCounts} />
            {renderDesktopSearch()}
          </section>

          <section className="relative flex-1">
            {shouldShowBlur && (
              <>
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="grid grid-cols-1 gap-[16px] blur-sm xl:grid-cols-4">
                    {backgroundSlots.map((slot) => (
                      <UniversitySlotCard key={slot.slotId} slot={slot} />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-white/80 backdrop-blur-[1px]">
                  <div className="flex w-full max-w-[420px] flex-col items-center gap-[16px] text-center">
                    <p className="medium-body-2 text-gray-900">성적 공유하고 지금 바로 경쟁률을 확인하세요.</p>
                    <button
                      onClick={handleCTAClick}
                      className="bg-primary-blue w-full rounded-[12px] px-[24px] py-[16px] font-semibold text-white shadow-[0_12px_24px_rgba(5,109,255,0.3)]"
                    >
                      성적 공유하고 전체 확인하기 🚀
                    </button>
                  </div>
                </div>
              </>
            )}

            {!shouldShowBlur && filteredSlots.length > 0 && (
              <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 xl:grid-cols-4">
                {filteredSlots.map((slot) => (
                  <UniversitySlotCard key={slot.slotId} slot={slot} />
                ))}
              </div>
            )}
          </section>
        </div>

        {!hasSharedGrade && selectedTab !== "지망한 대학" && <ShareGradeCTA seasonId={seasonId} />}
      </div>

      <Footer />
    </>
  );
}
