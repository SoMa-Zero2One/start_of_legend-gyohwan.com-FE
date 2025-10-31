import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";

export default function UniversitySlotCardSkeleton() {
  return (
    <div className="flex cursor-default flex-col items-end gap-[16px] rounded-[10px] border border-gray-100 p-[16px] shadow-[0_0_8px_rgba(0,0,0,0.06)]">
      {/* 첫 번째 줄: 학교 로고 + 이름 / 국기 + 국가명 */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-center gap-[8px]">
          {/* 학교 로고 (20x20) */}
          <div className="relative h-[20px] w-[20px] overflow-hidden">
            <SchoolLogoWithFallback
              src={null}
              alt="로딩 중"
              width={20}
              height={20}
              className="object-contain"
              isLoading
            />
          </div>
          {/* 학교 이름 (subhead-3, max-w-[200px]) */}
          <div className="h-[18px] w-[140px] animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex items-center gap-[4px]">
          {/* 국기 (20x20) */}
          <div className="h-[20px] w-[20px] animate-pulse rounded bg-gray-200" />
          {/* 국가명 (caption-1) */}
          <div className="h-[14px] w-[40px] animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* 두 번째 줄: 지원자 수 / 모집인원 (w-[286px]) */}
      <div className="flex w-[286px] justify-between">
        <div className="flex w-[130px] justify-between">
          <span className="caption-1 text-gray-700">지원자 수</span>
          {/* medium-body-3 */}
          <div className="h-[16px] w-[30px] animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex w-[130px] justify-between">
          <span className="caption-1 text-gray-700">모집인원</span>
          {/* medium-body-3 */}
          <div className="h-[16px] w-[30px] animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
