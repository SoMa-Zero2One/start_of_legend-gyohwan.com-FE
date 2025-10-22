"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import ApplicantCard from "@/components/strategy-room/ApplicantCard";
import { getSlotDetail } from "@/lib/api/slot";
import { SlotDetailResponse, Choice } from "@/types/slot";

type TabType = "지망순위" | "환산점수" | "학점";

export default function SlotDetailPage() {
  const params = useParams();
  const slotId = params.slotId as string;
  const seasonId = params.seasonId as string;

  const [data, setData] = useState<SlotDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>("지망순위");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getSlotDetail(parseInt(slotId));
        setData(result);
      } catch (err) {
        console.error("Slot detail fetch error:", err);
        setError("슬롯 상세 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slotId) {
      fetchData();
    }
  }, [slotId]);

  // 탭에 따른 정렬된 지원자 목록
  const sortedChoices = useMemo(() => {
    if (!data) return [];

    const choices = [...data.choices];

    if (selectedTab === "지망순위") {
      return choices.sort((a, b) => a.choice - b.choice);
    } else if (selectedTab === "환산점수") {
      return choices.sort((a, b) => {
        // null 값은 뒤로
        if (a.score === null && b.score === null) return 0;
        if (a.score === null) return 1;
        if (b.score === null) return -1;
        return b.score - a.score; // 내림차순
      });
    } else if (selectedTab === "학점") {
      return choices.sort((a, b) => {
        // null 값은 뒤로
        if (a.gpaScore === null && b.gpaScore === null) return 0;
        if (a.gpaScore === null) return 1;
        if (b.gpaScore === null) return -1;
        return b.gpaScore - a.gpaScore; // 내림차순
      });
    }

    return choices;
  }, [data, selectedTab]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="지원자 목록" showPrevButton />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="지원자 목록" showPrevButton />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-error-red">{error || "데이터를 찾을 수 없습니다."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* 상단 헤더 */}
      <Header title=" " showHomeButton homeHref={`/strategy-room/${seasonId}`} showBorder={false} />

      {/* 대학 정보 */}
      <section className="border-b border-gray-100 p-[20px]">
        {/* 학교 로고 */}
        <div>
          <div className="relative mb-[8px] h-[40px] w-[40px] overflow-hidden rounded-full">
            <Image
              src="/icons/ico_profile.svg"
              alt="University Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>

        {/* 학교 이름 */}
        <h2 className="head-4 mb-[20px]">{data.name}</h2>

        {/* 정보 목록 */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">국가</span>
            <span className="font-bold">{data.country}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">지원자 수</span>
            <span className="font-bold">{data.choiceCount}명</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">모집인원</span>
            <span className="font-bold">{data.slotCount}명</span>
          </div>
        </div>
      </section>

      {/* 지원자 목록 제목 */}
      <section className="px-[20px] py-[16px]">
        <h3 className="subhead-2">지원자 목록 ({data.choices.length}명)</h3>
        <p className="mt-[4px] text-gray-700">모든 지원자들의 성적 정보를 확인하세요.</p>
      </section>

      {/* 탭 메뉴 */}
      <div className="relative flex border-b border-gray-200">
        {(["지망순위", "환산점수", "학점"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`relative flex flex-1 cursor-pointer flex-col items-center py-[12px] text-[15px] font-medium ${
              selectedTab === tab ? "text-black" : "text-gray-700"
            }`}
          >
            <span>{tab}</span>
          </button>
        ))}
        {/* 애니메이션 적용된 탭 인디케이터 */}
        <span
          className="absolute bottom-0 h-[2px] rounded-full bg-black transition-all duration-300 ease-in-out"
          style={{
            width: "33.333%",
            left: selectedTab === "지망순위" ? "0%" : selectedTab === "환산점수" ? "33.333%" : "66.666%",
          }}
        />
      </div>

      {/* 지원자 목록 */}
      <div className="flex flex-1 flex-col gap-[10px] p-[20px]">
        {sortedChoices.length === 0 ? (
          <p className="text-center text-gray-500">지원자가 없습니다.</p>
        ) : (
          sortedChoices.map((choice) => <ApplicantCard key={choice.applicationId} choice={choice} />)
        )}
      </div>
    </div>
  );
}
