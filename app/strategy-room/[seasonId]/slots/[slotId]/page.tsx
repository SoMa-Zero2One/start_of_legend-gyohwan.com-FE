"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";
import Header from "@/components/layout/Header";
import ApplicantCard from "@/components/strategy-room/ApplicantCard";
import ShareGradeCTA from "@/components/strategy-room/ShareGradeCTA";
import Tabs from "@/components/common/Tabs";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import { getSlotDetail, getMyApplication } from "@/lib/api/slot";
import { SlotDetailResponse, MyApplicationResponse } from "@/types/slot";

type TabType = "지망순위" | "환산점수" | "학점";

// 상수 정의
const TOOLTIP_DURATION = 3000; // 툴팁 표시 시간 (ms)
const SHAKE_ANIMATION_DURATION = 500; // Shake 애니메이션 시간 (ms)

export default function SlotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slotId = params.slotId as string;
  const seasonId = params.seasonId as string;

  const [data, setData] = useState<SlotDetailResponse | null>(null);
  const [myApplication, setMyApplication] = useState<MyApplicationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL query parameter에서 초기 정렬 상태 읽기
  const sortParam = searchParams.get("sort") as TabType;
  const initialSort: TabType =
    sortParam && ["지망순위", "환산점수", "학점"].includes(sortParam) ? sortParam : "지망순위";

  const [selectedTab, setSelectedTab] = useState<TabType>(initialSort);
  const [showTooltip, setShowTooltip] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  // Timeout ID를 저장하기 위한 ref
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [slotResult, applicationResult] = await Promise.all([
          getSlotDetail(parseInt(slotId)),
          getMyApplication(parseInt(seasonId)).catch(() => null), // 지원서가 없을 수 있음
        ]);
        setData(slotResult);
        setMyApplication(applicationResult);
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slotId) {
      fetchData();
    }
  }, [slotId, seasonId]);

  // Cleanup: 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
    };
  }, []);

  // 지원자 카드 클릭 핸들러
  const handleApplicantClick = (applicationId: number) => {
    if (data?.hasApplied) {
      // 성적 공유 참여 시 -> 상세 페이지로 이동
      router.push(`/strategy-room/${seasonId}/applications/${applicationId}`);
    } else {
      // 이전 타이머가 있다면 정리
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }

      // 성적 공유 미참여 시 -> 툴팁 표시 + 버튼 흔들기
      setShouldShake(true);
      setShowTooltip(true);

      // 툴팁 숨김 타이머
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, TOOLTIP_DURATION);

      // Shake 애니메이션 종료 타이머
      shakeTimeoutRef.current = setTimeout(() => {
        setShouldShake(false);
      }, SHAKE_ANIMATION_DURATION);
    }
  };

  // 정렬 변경 핸들러 (URL 업데이트 포함)
  const handleSortChange = (sort: TabType) => {
    setSelectedTab(sort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.replace(`/strategy-room/${seasonId}/slots/${slotId}?${params.toString()}`, { scroll: false });
  };

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
        <Header title="지원자 목록" showPrevButton showBorder />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="지원자 목록" showPrevButton showBorder />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-error-red">{error || "데이터를 찾을 수 없습니다."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* 상단 헤더 */}
      <Header title=" " showPrevButton />

      {/* 대학 정보 */}
      <section className="border-b border-gray-100 p-[20px]">
        {/* 학교 로고 */}
        <div>
          <div className="relative mb-[8px] h-[40px] w-[40px] overflow-hidden rounded-full">
            <SchoolLogoWithFallback
              src={data.logoImageUrl}
              alt={`${data.name} 로고`}
              width={40}
              height={40}
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
      <Tabs tabs={["지망순위", "환산점수", "학점"] as const} selectedTab={selectedTab} onTabChange={handleSortChange} />

      {/* 지원자 목록 */}
      <div className="flex flex-1 flex-col gap-[10px] p-[20px] pb-[100px]">
        {sortedChoices.length === 0 ? (
          <p className="text-center text-gray-500">지원자가 없습니다.</p>
        ) : (
          sortedChoices.map((choice) => (
            <ApplicantCard
              key={choice.applicationId}
              choice={choice}
              onClick={() => handleApplicantClick(choice.applicationId)}
              isBlurred={!data?.hasApplied}
              isMe={myApplication?.applicationId === choice.applicationId}
            />
          ))
        )}
      </div>

      {/* 하단 고정 CTA */}
      {!data?.hasApplied && (
        <ShareGradeCTA
          seasonId={seasonId}
          showTooltip={showTooltip}
          shouldShake={shouldShake}
          tooltipMessage="성적 공유하면 지원자들이 어느 학교에 지원했는지 확인할 수 있어요!"
        />
      )}
    </div>
  );
}
