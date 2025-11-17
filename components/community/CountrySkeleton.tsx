/**
 * Country 탭 로딩 Skeleton UI
 *
 * USAGE: CountryContent에서 데이터 로딩 중일 때 표시
 *
 * WHAT: CountryListItem과 동일한 레이아웃의 skeleton 컴포넌트
 *
 * WHY:
 * - 로딩 중에도 예상 레이아웃을 보여줌 (CLS 방지)
 * - 사용자에게 "로딩 중"임을 시각적으로 전달
 * - 체감 로딩 속도 개선
 */
export default function CountrySkeleton() {
  return (
    <div className="flex flex-col gap-[12px]">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex w-full items-center justify-between rounded-[12px] border border-gray-100 bg-white p-[16px] shadow-[0_0_8px_0_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-center gap-[12px]">
            {/* Flag emoji placeholder */}
            <div className="h-[48px] w-[48px] animate-pulse rounded-full bg-gray-200" />
            <div className="flex flex-col gap-[6px]">
              {/* Country name */}
              <div className="h-[18px] w-[120px] animate-pulse rounded bg-gray-200" />
              {/* Continent */}
              <div className="h-[14px] w-[60px] animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          {/* Chevron icon placeholder */}
          <div className="h-[20px] w-[20px] animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
