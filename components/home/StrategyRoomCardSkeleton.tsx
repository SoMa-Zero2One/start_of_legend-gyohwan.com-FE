export default function StrategyRoomCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-[20px] rounded-[16px] border border-gray-300 p-[20px]">
      {/* 상단: 로고 + 학교명 + 날짜 영역 */}
      <div className="flex items-center gap-3">
        {/* 로고 스켈레톤 */}
        <div className="h-[80px] w-[80px] animate-pulse rounded-lg bg-gray-200" />

        {/* 텍스트 영역 스켈레톤 */}
        <div className="flex flex-col gap-2">
          {/* 학교명 */}
          <div className="h-[18px] w-[120px] animate-pulse rounded bg-gray-200" />
          {/* 날짜 + D-Day */}
          <div className="flex items-center gap-2">
            <div className="h-[14px] w-[180px] animate-pulse rounded bg-gray-200" />
            <div className="h-[20px] w-[50px] animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* 하단 버튼 2개 스켈레톤 */}
      <div className="flex gap-[10px]">
        <div className="h-[36px] flex-1 animate-pulse rounded-[50px] bg-gray-200" />
        <div className="h-[36px] flex-1 animate-pulse rounded-[50px] bg-gray-200" />
      </div>
    </div>
  );
}
