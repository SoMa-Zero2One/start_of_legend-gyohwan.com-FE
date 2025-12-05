"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import SearchDialog from "@/components/common/SearchDialog";
import Footer from "@/components/layout/Footer";
import UniversitySlotCard from "@/components/strategy-room/UniversitySlotCard";
import StrategyRoomPageSkeleton from "@/components/strategy-room/StrategyRoomPageSkeleton";
import Tabs from "@/components/common/Tabs";
import ShareGradeCTA from "@/components/strategy-room/ShareGradeCTA";
import { getSeasonSlots, getMyApplication } from "@/lib/api/slot";
import { handleApiError } from "@/lib/utils/apiError";
import { SeasonSlotsResponse, MyApplicationResponse } from "@/types/slot";

type TabType = "지망한 대학" | "지원자가 있는 대학" | "모든 대학";

export default function StrategyRoomClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const seasonId = params.seasonId as string;

  const [data, setData] = useState<SeasonSlotsResponse | null>(null);
  const [myApplication, setMyApplication] = useState<MyApplicationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL query parameter에서 초기 탭 상태 읽기
  const tabParam = searchParams.get("tab") as TabType;

  const [selectedTab, setSelectedTab] = useState<TabType>(
    tabParam && ["지망한 대학", "지원자가 있는 대학", "모든 대학"].includes(tabParam) ? tabParam : "지원자가 있는 대학"
  );
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

  // hasApplied가 true이고 URL에 tab 파라미터가 없으면 "지망한 대학" 탭으로 자동 설정
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (data?.hasApplied && !tabParam) {
      setSelectedTab("지망한 대학");
    }
  }, [data?.hasApplied, searchParams]);

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
  const universityName = data.seasonName.split(" ")[0]; // "영남대학교"
  const match = data.seasonName.match(/(\d{4})-(\d)/);
  const parsedSemester = match ? `${match[1].slice(-2)}-${match[2]} 학기` : "";

  return (
    <>
      <div className="flex min-h-screen flex-col">
        {/* 상단 헤더 */}
        <Header
          title={data.seasonName}
          showSearchButton
          showPrevButton
          showHomeButton
          onSearchClick={() => setIsSearchDialogOpen(true)}
        />

        <SearchDialog
          isOpen={isSearchDialogOpen}
          value={searchQuery}
          onChange={setSearchQuery}
          onClose={() => {
            setIsSearchDialogOpen(false);
            setSearchQuery("");
          }}
          placeholder="대학명 또는 국가로 검색..."
        />

        {/* 제목 */}
        <section className="px-[20px] py-[16px]">
          <p className="caption-1">{parsedSemester}</p>
          <div className="mt-[8px] flex items-center justify-between">
            <h1 className="head-4">{universityName} 교환학생</h1>
            {hasSharedGrade && (
              <Link
                href={`/strategy-room/${seasonId}/applications/re-select-university`}
                className="cursor-pointer rounded-full bg-gray-300 px-[12px] py-[6px] text-[12px]"
              >
                지원 대학교 변경
              </Link>
            )}
          </div>
          <div className="relative mt-[12px] inline-block overflow-hidden rounded-full bg-gradient-to-r from-[#056DFF] via-[#029EFA] to-[#00D0FF] p-[1px]">
            <span className="text-primary-blue caption-2 block rounded-full bg-[#E9F1FF] px-3 py-1">
              🔥 총 {data.applicantCount}명 성적 공유 참여 중!
            </span>
          </div>

          {/* 세종대 전용 오픈채팅방 버튼 */}
          {parseInt(seasonId) === 3 && (
            <a
              href="https://open.kakao.com/o/gGFH29Yh"
              target="_blank"
              rel="noopener noreferrer"
              className="body-2 mt-[12px] flex cursor-pointer items-center justify-center gap-[8px] rounded-[8px] bg-[#FEE500] px-[16px] py-[12px] font-semibold text-[#3C1E1E] transition-transform hover:scale-[1.02]"
            >
              💬 세종대 교환학생 함께 준비하기
            </a>
          )}

          {/* 커뮤니티 버튼 */}
          <Link
            href="/community"
            className="btn-primary body-2 mt-[12px] flex items-center justify-center gap-[8px] rounded-[8px] px-[16px] py-[12px] font-semibold"
          >
            💬 실생활 보러 가기
          </Link>
        </section>

        {/* 탭 메뉴 */}
        <Tabs
          tabs={["지망한 대학", "지원자가 있는 대학", "모든 대학"] as const}
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          counts={{
            "지망한 대학": !hasSharedGrade ? 0 : myChosenUniversities.length,
            "지원자가 있는 대학": data.slots.filter((slot) => slot.choiceCount !== null && slot.choiceCount >= 1)
              .length,
            "모든 대학": data.slots.length,
          }}
        />

        {/* 대학 리스트 */}
        <div className="relative flex flex-1 flex-col gap-[10px] p-[20px]">
          {/* blur 처리된 배경 (지망한 대학 + 미참여 시) */}
          {shouldShowBlur && (
            <>
              <div className="absolute inset-0 overflow-hidden p-[20px]">
                <div className="pointer-events-none flex flex-col gap-[10px] blur-sm">
                  {backgroundSlots.map((slot) => (
                    <UniversitySlotCard key={slot.slotId} slot={slot} />
                  ))}
                </div>
              </div>
              {/* 중앙 CTA 오버레이 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="medium-body-2 flex w-full max-w-[350px] flex-col items-center gap-[20px] px-[20px]">
                  <div>성적 공유하고 지금 바로 경쟁률을 확인하세요.</div>
                  <button
                    onClick={handleCTAClick}
                    className="bg-primary-blue w-full cursor-pointer rounded-[8px] py-[16px] text-white shadow-[0_4px_12px_rgba(5,109,255,0.3)]"
                  >
                    성적 공유하고 전체 확인하기 🚀
                  </button>
                </div>
              </div>
            </>
          )}

          {/* 일반 리스트 (참여했거나 다른 탭) */}
          {!shouldShowBlur && (
            <>
              {filteredSlots.map((slot) => (
                <UniversitySlotCard key={slot.slotId} slot={slot} />
              ))}
            </>
          )}
        </div>

        {/* 하단 고정 CTA (미참여 시에는 숨김) */}
        {!hasSharedGrade && selectedTab !== "지망한 대학" && <ShareGradeCTA seasonId={seasonId} />}
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
