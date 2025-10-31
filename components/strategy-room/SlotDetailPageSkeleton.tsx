import Header from "@/components/layout/Header";
import ApplicantCardSkeleton from "@/components/strategy-room/ApplicantCardSkeleton";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";

export default function SlotDetailPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 상단 헤더 - 실제와 동일 */}
      <Header title="지원자 목록" showPrevButton showHomeButton />

      {/* 대학 정보 섹션 - 실제 구조 기반 */}
      <section className="border-b border-gray-100 p-[20px]">
        {/* 학교 로고 */}
        <div className="mb-[8px]">
          <div className="relative h-[40px] w-[40px] overflow-hidden rounded-full">
            <SchoolLogoWithFallback
              src={null}
              alt="로딩 중"
              width={40}
              height={40}
              className="object-contain"
              isLoading
            />
          </div>
        </div>

        {/* 학교 이름 (head-4) */}
        <div className="mb-[8px] h-[24px] w-[180px] animate-pulse rounded bg-gray-200" />

        {/* 홈페이지 버튼 (조건부이므로 일단 표시) */}
        <div className="mb-[20px] inline-flex items-center gap-[4px] rounded-full bg-gray-300 px-[12px] py-[6px]">
          <span className="inline-block h-[12px] w-[100px] animate-pulse rounded bg-gray-400" />
        </div>

        {/* 정보 목록 - 실제와 동일한 구조 */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">국가</span>
            <div className="h-[20px] w-[50px] animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">지원자 수</span>
            <div className="h-[20px] w-[40px] animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">모집인원</span>
            <div className="h-[20px] w-[40px] animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </section>

      {/* 지원자 목록 제목 - 실제 구조 기반 */}
      <section className="px-[20px] py-[16px]">
        {/* subhead-2 */}
        <div className="h-[20px] w-[130px] animate-pulse rounded bg-gray-200" />
        {/* 설명 텍스트 */}
        <div className="mt-[4px] h-[16px] w-[220px] animate-pulse rounded bg-gray-200" />
      </section>

      {/* 탭 메뉴 - 실제 Tabs 컴포넌트 구조 기반 */}
      <div className="relative flex border-b border-gray-200">
        {["지망순위", "환산점수", "학점"].map((tab) => (
          <div
            key={tab}
            className="medium-body-3 relative flex flex-1 flex-col items-center py-[12px] text-gray-700"
          >
            <span>{tab}</span>
          </div>
        ))}
        {/* 탭 인디케이터 */}
        <span className="absolute bottom-0 h-[2px] w-[33.33%] rounded-full bg-black" />
      </div>

      {/* 지원자 목록 - 실제와 동일한 padding */}
      <div className="flex flex-1 flex-col gap-[10px] p-[20px] pb-[100px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <ApplicantCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
