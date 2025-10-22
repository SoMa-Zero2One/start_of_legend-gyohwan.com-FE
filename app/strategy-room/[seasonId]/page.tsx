"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import UniversitySlotCard from "@/components/strategy-room/UniversitySlotCard";
import Tabs from "@/components/common/Tabs";
import ShareGradeCTA from "@/components/strategy-room/ShareGradeCTA";
import { getSeasonSlots } from "@/lib/api/slot";
import { SeasonSlotsResponse } from "@/types/slot";

export default function StrategyRoomPage() {
  const params = useParams();
  const router = useRouter();
  const seasonId = params.seasonId as string;

  const [data, setData] = useState<SeasonSlotsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type TabType = "지망한 대학" | "지원자가 있는 대학" | "모든 대학";
  const [selectedTab, setSelectedTab] = useState<TabType>("지원자가 있는 대학");
  const [searchQuery, setSearchQuery] = useState("");

  // 임시: 성적 공유 여부 (나중에 API로 확인)
  const [hasSharedGrade] = useState(false);

  // 임시: 내가 지원한 대학 목록 (slotId 배열)
  const myChosenUniversities = useMemo(() => [2, 3], []); // 임시 데이터

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getSeasonSlots(parseInt(seasonId));
        setData(result);
      } catch (err) {
        console.error("Slots fetch error:", err);
        setError("슬롯 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (seasonId) {
      fetchData();
    }
  }, [seasonId]);

  // 필터링된 슬롯 목록 (탭 + 검색)
  const filteredSlots = useMemo(() => {
    if (!data) return [];

    // 1단계: 탭에 따른 필터링
    let slots = data.slots;

    if (selectedTab === "지원자가 있는 대학") {
      slots = data.slots.filter((slot) => slot.choiceCount >= 1);
    } else if (selectedTab === "지망한 대학") {
      slots = data.slots.filter((slot) => myChosenUniversities.includes(slot.slotId));
    }

    // 2단계: 검색어에 따른 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      slots = slots.filter(
        (slot) => slot.name.toLowerCase().includes(query) || slot.country.toLowerCase().includes(query)
      );
    }

    return slots;
  }, [selectedTab, data, myChosenUniversities, searchQuery]);

  // "지망한 대학" 탭 + 미참여 시 blur 처리
  const shouldShowBlur = selectedTab === "지망한 대학" && !hasSharedGrade;

  // blur 배경용 슬롯 (지원자가 있는 대학)
  const backgroundSlots = useMemo(() => {
    if (!data) return [];
    return data.slots.filter((slot) => slot.choiceCount >= 1);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="전략실" showPrevButton />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="전략실" showPrevButton />
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
    <div className="flex min-h-screen flex-col">
      {/* 상단 헤더 */}
      <Header
        title={data.seasonName}
        showSearchButton
        showHomeButton
        homeHref={`/strategy-room/${seasonId}`}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showBorder={false}
      />

      {/* 제목 */}
      <section className="px-[20px] py-[16px]">
        <h2 className="caption-1">{parsedSemester}</h2>
        <h2 className="head-4 mt-[8px]">{universityName} 교환학생</h2>
        <div className="relative mt-[12px] inline-block overflow-hidden rounded-full bg-gradient-to-r from-[#056DFF] via-[#029EFA] to-[#00D0FF] p-[1px]">
          <span className="text-primary-blue caption-2 block rounded-full bg-[#E9F1FF] px-3 py-1">
            🔥 총 {}명 성적 공유 참여 중!
          </span>
        </div>
      </section>

      {/* 탭 메뉴 */}
      <Tabs
        tabs={["지망한 대학", "지원자가 있는 대학", "모든 대학"] as const}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        counts={{
          "지망한 대학": !hasSharedGrade ? 0 : myChosenUniversities.length,
          "지원자가 있는 대학": data.slots.filter((slot) => slot.choiceCount >= 1).length,
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
                  onClick={() => router.push(`/strategy-room/${seasonId}/applications/new`)}
                  className="bg-primary-blue w-full rounded-[8px] py-[16px] text-white shadow-[0_4px_12px_rgba(5,109,255,0.3)]"
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
      {!shouldShowBlur && <ShareGradeCTA seasonId={seasonId} />}
    </div>
  );
}
