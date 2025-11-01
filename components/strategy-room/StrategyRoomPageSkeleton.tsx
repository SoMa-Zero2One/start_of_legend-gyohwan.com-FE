import Header from "@/components/layout/Header";
import UniversitySlotCardSkeleton from "@/components/strategy-room/UniversitySlotCardSkeleton";

export default function StrategyRoomPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 상단 헤더 - 실제와 동일 */}
      <Header title="실시간 경쟁률" showSearchButton showPrevButton showHomeButton />

      {/* 제목 섹션 - 실제 구조 기반 */}
      <section className="px-[20px] py-[16px]">
        {/* 학기 (caption-1) */}
        <div className="h-[14px] w-[70px] animate-pulse rounded bg-gray-200" />

        {/* 대학 이름 (head-4) + 변경 버튼 공간 */}
        <div className="mt-[8px] flex items-center justify-between">
          <div className="h-[24px] w-[160px] animate-pulse rounded bg-gray-200" />
          {/* 버튼 공간 (조건부 렌더링이므로 비워둠) */}
        </div>

        {/* 참여자 수 배지 - 실제 크기 기반 */}
        <div className="relative mt-[12px] inline-block overflow-hidden rounded-full bg-gradient-to-r from-[#056DFF] via-[#029EFA] to-[#00D0FF] p-[1px]">
          <span className="caption-2 block rounded-full bg-[#E9F1FF] px-3 py-1">
            <span className="inline-block h-[14px] w-[150px] animate-pulse rounded bg-gray-300" />
          </span>
        </div>
      </section>

      {/* 탭 메뉴 - 실제 Tabs 컴포넌트 구조 기반 */}
      <div className="relative flex border-b border-gray-200">
        {["지망한 대학", "지원자가 있는 대학", "모든 대학"].map((tab) => (
          <div key={tab} className="medium-body-3 relative flex flex-1 flex-col items-center py-[12px] text-gray-700">
            <span>{tab}</span>
            <span className="mt-[2px] text-[12px]">
              <span className="inline-block h-[12px] w-[20px] animate-pulse rounded bg-gray-200" />
            </span>
          </div>
        ))}
        {/* 탭 인디케이터 */}
        <span className="absolute bottom-0 h-[2px] w-[33.33%] rounded-full bg-black" style={{ left: "33.33%" }} />
      </div>

      {/* 대학 리스트 - 실제와 동일한 padding */}
      <div className="relative flex flex-1 flex-col gap-[10px] p-[20px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <UniversitySlotCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
