"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";
import Header from "@/components/layout/Header";
import HeaderAuthSection from "@/components/layout/HeaderAuthSection";
import ApplicantCard from "@/components/strategy-room/ApplicantCard";
import SlotDetailPageSkeleton from "@/components/strategy-room/SlotDetailPageSkeleton";
import ShareGradeCTA from "@/components/strategy-room/ShareGradeCTA";
import Tabs from "@/components/common/Tabs";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import CountryFlag from "@/components/common/CountryFlag";
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon";
import CommunityIcon from "@/components/icons/CommunityIcon";
import GlobeIcon from "@/components/icons/GlobeIcon";
import UserIcon from "@/components/icons/UserIcon";
import HandIcon from "@/components/icons/HandIcon";
import Link from "next/link";
import { getSlotDetail, getMyApplication } from "@/lib/api/slot";
import { handleApiError } from "@/lib/utils/apiError";
import { SlotDetailResponse, MyApplicationResponse } from "@/types/slot";
import { getSlotSafeDefaults, getChoiceCountDisplay, getSlotCountDisplay } from "@/lib/utils/slot";
import { useIsDesktop } from "@/lib/hooks/useMediaQuery";
import Footer from "@/components/layout/Footer";

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
  const isDesktop = useIsDesktop();

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
  const hasSharedGrade = data?.hasApplied ?? false;

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
      } catch (error) {
        console.error("Data fetch error:", error);
        const errorMessage = handleApiError(error);
        setError(errorMessage);
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

  // 환산점수 시스템 사용 여부 확인 (모든 choices의 score를 확인)
  const hasScoreSystem = useMemo(() => {
    if (!data || data.choices.length === 0) return false;
    // 하나라도 score가 null이 아니면 환산점수 있음 (실제로는 다 있거나 다 없음)
    return data.choices.some((choice) => choice.score !== null);
  }, [data]);

  // 사용 가능한 탭 목록 (환산점수 없으면 제외)
  const availableTabs = useMemo(() => {
    if (hasScoreSystem) {
      return ["지망순위", "환산점수", "학점"] as const;
    }
    return ["지망순위", "학점"] as const;
  }, [hasScoreSystem]);

  // 환산점수 탭이 없어졌을 때 selectedTab 자동 변경
  useEffect(() => {
    if (!hasScoreSystem && selectedTab === "환산점수") {
      const currentSort = searchParams.get("sort");
      // 이미 올바른 값이면 업데이트 안 함 (무한 루프 방지)
      if (currentSort === "지망순위") return;

      setSelectedTab("지망순위");
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", "지망순위");
      router.replace(`/strategy-room/${seasonId}/slots/${slotId}?${params.toString()}`, { scroll: false });
    }
    // Warning: exhaustive-deps 경고 해결
    // searchParams를 dependency에 추가하지 않는 이유:
    // 1. searchParams를 추가하면 router.replace 실행 시 무한 루프 발생
    // 2. selectedTab === "환산점수" 체크로 이미 중복 실행 방지
    // 3. router.replace 실행 후 selectedTab이 "지망순위"로 변경되어 재실행 안 됨
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasScoreSystem, selectedTab, router, seasonId, slotId]);

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
    return <SlotDetailPageSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="지원자 목록" showPrevButton showHomeButton showBorder fallbackUrl={`/strategy-room/${seasonId}`}>
          {isDesktop && <HeaderAuthSection />}
        </Header>
        <div className="flex flex-1 items-center justify-center px-[20px] text-center">
          <p className="text-error-red">{error || "데이터를 찾을 수 없습니다."}</p>
        </div>
      </div>
    );
  }

  // 방어적 기본값 적용
  const { name, country, choiceCount, slotCount, logoUrl } = getSlotSafeDefaults(data);

  // 표시용 문자열
  const choiceCountDisplay = getChoiceCountDisplay(choiceCount);
  const slotCountDisplay = getSlotCountDisplay(slotCount);

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header title="지원자 목록" showPrevButton showHomeButton fallbackUrl={`/strategy-room/${seasonId}`}>
          {isDesktop && <HeaderAuthSection />}
        </Header>

        <section className="flex flex-col border-b border-gray-100 p-[20px] lg:flex-row lg:gap-[40px]">
          <div className="head-4 mb-[20px] lg:mb-[24px] lg:line-clamp-2 lg:flex-1 lg:text-ellipsis">
            <div className="relative mb-[8px] h-[40px] w-[40px] overflow-hidden rounded-full lg:h-[60px] lg:w-[60px]">
              <SchoolLogoWithFallback
                src={logoUrl}
                alt={`${name} 로고`}
                fill
                sizes="(min-width:1024px) 60px, 40px"
                className="h-[40px] w-[40px] object-contain lg:h-[60px] lg:w-[60px]"
              />
            </div>

            <h2>{name}</h2>
          </div>

          <div className="flex flex-col gap-[12px] lg:flex-row lg:justify-between">
            <div className="flex justify-between rounded-[16px] lg:w-[254px] lg:flex-col lg:border lg:border-gray-300 lg:p-[24px] lg:shadow-[0_0_8px_0_rgba(0_0_0_/_0.06)]">
              <div className="flex items-center gap-[8px] text-gray-700 lg:!text-[18px] lg:!font-bold lg:text-black">
                {isDesktop && <GlobeIcon size={18} />}
                <span>국가</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex gap-[8px] lg:!text-[24px]">
                  {isDesktop && <CountryFlag country={country} size={30} />}
                  <span className="font-bold">{country}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between rounded-[16px] lg:w-[254px] lg:flex-col lg:border lg:border-gray-300 lg:p-[24px] lg:shadow-[0_0_8px_0_rgba(0_0_0_/_0.06)]">
              <div className="flex items-center gap-[8px] text-gray-700 lg:!text-[18px] lg:!font-bold lg:text-black">
                {isDesktop && <HandIcon size={18} />}
                <span>지원자 수</span>
              </div>
              <div className="flex flex-col items-end lg:!text-[24px]">
                <span className="font-bold">{choiceCountDisplay}</span>
              </div>
            </div>
            <div className="flex justify-between rounded-[16px] lg:w-[254px] lg:flex-col lg:border lg:border-gray-300 lg:p-[24px] lg:shadow-[0_0_8px_0_rgba(0_0_0_/_0.06)]">
              <div className="flex items-center gap-[8px] text-gray-700 lg:!text-[18px] lg:!font-bold lg:text-black">
                {isDesktop && <UserIcon size={18} />}
                <span>모집인원</span>
              </div>
              <div className="flex flex-col items-end lg:!text-[24px]">
                <span className="font-bold">{slotCountDisplay}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-[12px] flex flex-col items-start justify-between gap-[8px] rounded-[12px] border border-gray-100 bg-gray-50 p-[12px] text-gray-700 lg:flex-row lg:items-center lg:px-[24px] lg:py-[16px]">
          <p>홈페이지와 커뮤니티에서 학교 정보와 선배들의 파견 생생 후기를 확인할 수 있어요.</p>
          <div className="flex gap-[12px]">
            {data.homepageUrl && (
              <a
                href={data.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="caption-2 inline-flex cursor-pointer items-center gap-[4px] rounded-full bg-gray-300 px-[12px] py-[6px] hover:bg-gray-500 lg:gap-[6px] lg:px-[16px] lg:py-[10px] lg:!text-[13px]"
              >
                홈페이지 바로가기
                <ExternalLinkIcon size={isDesktop ? 16 : 12} />
              </a>
            )}

            <Link
              href={data.universityId ? `/community/university/${data.universityId}` : "/community?tabs=대학"}
              className="caption-2 btn-primary inline-flex cursor-pointer items-center gap-[4px] rounded-full px-[12px] py-[6px] lg:gap-[6px] lg:px-[16px] lg:py-[10px] lg:!text-[13px]"
            >
              파견 생활 알아보기
              <CommunityIcon size={isDesktop ? 16 : 12} className="text-white" />
            </Link>
          </div>
        </div>

        <section className="px-[20px] pt-[16px]">
          <h3 className="subhead-2 lg:!text-[20px]">지원자 목록 ({data.choices.length}명)</h3>
          <p className="mt-[4px] text-gray-700 lg:!text-[16px]">모든 지원자들의 성적 정보를 확인하세요.</p>
        </section>

        <Tabs className="lg:p-[20px]" tabs={availableTabs} selectedTab={selectedTab} onTabChange={handleSortChange} />
        <div className="grid grid-cols-1 gap-[10px] px-[20px] py-[20px] pb-[100px] lg:grid-cols-3">
          {sortedChoices.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">지원자가 없습니다.</p>
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

        {!hasSharedGrade && (
          <ShareGradeCTA
            seasonId={seasonId}
            showTooltip={showTooltip}
            shouldShake={shouldShake}
            tooltipMessage="성적 공유하면 지원자들이 어느 학교에 지원했는지 확인할 수 있어요!"
          />
        )}
      </div>
      <Footer />
    </>
  );
}
