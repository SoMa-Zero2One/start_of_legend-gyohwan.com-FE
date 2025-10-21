"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import UniversitySlotCard from "@/components/strategy-room/UniversitySlotCard";
import { getSeasonSlots } from "@/lib/api/slot";
import { SeasonSlotsResponse } from "@/types/slot";

export default function StrategyRoomPage() {
  const params = useParams();
  const router = useRouter();
  const seasonId = params.seasonId as string;

  const [data, setData] = useState<SeasonSlotsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"지망한 대학" | "지원자가 있는 대학" | "모든 대학">(
    "지원자가 있는 대학"
  );

  // 임시: 성적 공유 여부 (나중에 API로 확인)
  const [hasSharedGrade, setHasSharedGrade] = useState(false);

  // 임시: 내가 지원한 대학 목록 (slotId 배열)
  const myChosenUniversities = [2, 3]; // 임시 데이터

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

  // 필터링된 슬롯 목록
  const filteredSlots = useMemo(() => {
    if (!data) return [];

    if (selectedTab === "지원자가 있는 대학") {
      return data.slots.filter((slot) => slot.choiceCount >= 1);
    }

    if (selectedTab === "모든 대학") {
      return data.slots;
    }

    if (selectedTab === "지망한 대학") {
      return data.slots.filter((slot) => myChosenUniversities.includes(slot.slotId));
    }

    return data.slots;
  }, [selectedTab, data, myChosenUniversities]);

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
        <Header title="전략실" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="전략실" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-red-500">{error || "데이터를 찾을 수 없습니다."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* 상단 헤더 */}
      <Header />

      {/* 제목 */}
      <section className="px-[20px] py-[16px]">
        <h2 className="text-[20px] leading-snug font-bold">
          {data.seasonName.split(" ")[0]}
          <br />
          교환학생
        </h2>
        <div className="mt-[10px] flex items-center gap-2">
          <span className="rounded-full bg-[#E9F1FF] px-3 py-1 text-[13px] text-[#056DFF]">
            🔥 총 {}명 성적 공유 참여 중!
          </span>
        </div>
      </section>

      {/* 탭 메뉴 */}
      <div className="flex items-center justify-around border-b border-gray-200">
        {["지망한 대학", "지원자가 있는 대학", "모든 대학"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as any)}
            className={`relative py-[12px] text-[15px] font-medium ${
              selectedTab === tab ? "text-black" : "text-gray-400"
            }`}
          >
            {tab}
            {selectedTab === tab && <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-black" />}
          </button>
        ))}
      </div>

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
      {!shouldShowBlur && (
        <div className="fixed bottom-0 left-1/2 w-full max-w-[420px] -translate-x-1/2 bg-white px-[20px] pb-[20px]">
          <div className="pointer-events-none absolute -top-[60px] left-0 h-[60px] w-full bg-gradient-to-t from-white to-transparent" />

          <button
            onClick={() => router.push(`/strategy-room/${seasonId}/applications/new`)}
            className="w-full rounded-[12px] bg-[#056DFF] py-[16px] font-medium text-white shadow-[0_0_8px_rgba(0,0,0,0.06)]"
          >
            성적 공유하고 전체 확인하기 🚀
          </button>
        </div>
      )}
    </div>
  );
}
