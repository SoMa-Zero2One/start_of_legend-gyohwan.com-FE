/**
 * University 탭 로딩 Skeleton UI
 *
 * USAGE: UniversityContent에서 데이터 로딩 중일 때 표시
 *
 * WHAT: UniversityTable과 유사한 레이아웃의 skeleton 컴포넌트
 *
 * WHY:
 * - 로딩 중에도 예상 레이아웃을 보여줌 (CLS 방지)
 * - 사용자에게 "로딩 중"임을 시각적으로 전달
 * - 체감 로딩 속도 개선
 */
export default function UniversitySkeleton() {
  return (
    <div className="flex flex-col gap-[8px] px-[20px] pb-[80px]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-10 flex gap-[8px] border-b border-gray-200 bg-white pb-[8px]">
        <div className="h-[40px] w-[60px] animate-pulse rounded bg-gray-200" />
        <div className="h-[40px] flex-1 animate-pulse rounded bg-gray-200" />
        <div className="h-[40px] w-[80px] animate-pulse rounded bg-gray-200" />
      </div>

      {/* Row skeletons */}
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="flex gap-[8px] border-b border-gray-100 py-[12px]">
          <div className="h-[20px] w-[60px] animate-pulse rounded bg-gray-200" />
          <div className="h-[20px] flex-1 animate-pulse rounded bg-gray-200" />
          <div className="h-[20px] w-[80px] animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
