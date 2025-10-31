export default function ApplicantCardSkeleton() {
  return (
    <div className="flex cursor-default flex-col gap-[16px] rounded-[8px] bg-white p-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {/* 닉네임 + ME 배지 공간 (subhead-3) */}
      <div className="flex items-center gap-[8px]">
        <div className="h-[20px] w-[80px] animate-pulse rounded bg-gray-200" />
        {/* ME 배지는 조건부이므로 생략 */}
      </div>

      {/* 정보 그리드 - 실제와 동일한 구조 */}
      <div className="grid grid-cols-2 gap-x-[24px] gap-y-[12px]">
        {/* Row 1: 지망 / 환산점수 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">지망</span>
          <div className="h-[16px] w-[50px] animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">환산점수</span>
          <div className="h-[16px] w-[60px] animate-pulse rounded bg-gray-200" />
        </div>

        {/* Row 2: 학점 / 어학성적 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">학점</span>
          <div className="h-[16px] w-[70px] animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">어학성적</span>
          <div className="h-[16px] w-[80px] animate-pulse rounded bg-gray-200" />
        </div>

        {/* Row 3: 가산점 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">가산점</span>
          <div className="h-[16px] w-[50px] animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
