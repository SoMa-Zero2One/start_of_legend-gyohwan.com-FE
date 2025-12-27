"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import HeaderAuthSection from "@/components/layout/HeaderAuthSection";
import GradeProgressBar from "@/components/application/GradeProgressBar";
import LanguageChart from "@/components/application/LanguageChart";
import UniversitySlotCard from "@/components/strategy-room/UniversitySlotCard";
import SchoolIcon from "@/components/icons/SchoolIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import { useIsDesktop } from "@/lib/hooks/useMediaQuery";
import { getApplicationDetail, getMyApplication, getSeasonSlots } from "@/lib/api/slot";
import { handleApiError } from "@/lib/utils/apiError";
import { ApplicationDetailResponse, MyApplicationResponse, SeasonSlotsResponse } from "@/types/slot";
import Footer from "@/components/layout/Footer";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const seasonId = parseInt(params.seasonId as string);
  const applicationId = parseInt(params.applicationId as string);

  const [data, setData] = useState<ApplicationDetailResponse | null>(null);
  const [myApplication, setMyApplication] = useState<MyApplicationResponse | null>(null);
  const [seasonData, setSeasonData] = useState<SeasonSlotsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDesktop = useIsDesktop();

  const isMe = myApplication?.applicationId === applicationId;
  const hasApplied = seasonData?.hasApplied ?? false;
  const languageCount = data?.language?.testType ? 1 : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // seasonData는 항상 필요 (hasApplied 확인용)
        const seasonResult = await getSeasonSlots(seasonId);
        setSeasonData(seasonResult);

        // hasApplied=false면 applicationDetail 실패해도 오버레이 표시
        const [applicationResult, myAppResult] = await Promise.all([
          getApplicationDetail(applicationId).catch(() => null),
          getMyApplication(seasonId).catch(() => null),
        ]);

        setData(applicationResult);
        setMyApplication(myAppResult);
      } catch (error) {
        console.error("Data fetch error:", error);
        const errorMessage = handleApiError(error);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [applicationId, seasonId]);

  // CTA 버튼 클릭 핸들러
  // Layout에서 이미 로그인/학교인증을 체크하므로 직접 이동만 함
  const handleCTAClick = () => {
    router.push(`/strategy-room/${seasonId}/applications/new`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // hasApplied=false면 data가 없어도 오버레이를 보여주기 위해 렌더링
  if (error || (!data && hasApplied)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">{error || "데이터를 찾을 수 없습니다."}</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* hasApplied = false일 때 오버레이 */}
      {!hasApplied && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/95 px-[20px]">
          <div className="medium-body-2 flex w-full max-w-[350px] flex-col items-center gap-[20px] px-[20px]">
            <div className="text-center">성적 공유하고 지금 바로 경쟁률을 확인하세요.</div>
            <button
              onClick={handleCTAClick}
              className="bg-primary-blue w-full rounded-[8px] py-[16px] text-white shadow-[0_4px_12px_rgba(5,109,255,0.3)]"
            >
              성적 공유하고 전체 확인하기 🚀
            </button>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 - data가 있을 때만 렌더링 */}
      {data && (
        <>
          <Header
            title={isMe ? "내 프로필" : "프로필"}
            showPrevButton
            showHomeButton
            fallbackUrl={`/strategy-room/${seasonId}`}
          >
            {isDesktop && <HeaderAuthSection />}
          </Header>
          <main className="flex flex-1 flex-col px-[20px] pb-[40px] xl:pb-[80px]">
            <div className="flex flex-col gap-[20px] py-[20px] xl:gap-[24px] xl:py-[32px]">
              {/* 상단 요약 */}
              <section className="flex flex-col gap-[20px] border-b-[8px] border-gray-300 py-[20px] xl:flex-row xl:items-center xl:border-0 xl:bg-[#FAFAFA] xl:p-[40px]">
                <div className="flex flex-1 gap-[4px] xl:gap-[8px]">
                  <h1 className="text-[24px] font-bold xl:text-[36px]">{data.nickname}</h1>
                  <div className="flex items-start xl:items-center">
                    {isMe && (
                      <span className="bg-primary-blue rounded-full px-[6px] py-[2px] text-[10px] font-bold text-white xl:text-[12px]">
                        ME
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-[24px] text-gray-700 xl:text-black">
                  <div className="flex flex-1 justify-between rounded-[16px] xl:w-[254px] xl:flex-none xl:flex-col xl:bg-white xl:p-[24px]">
                    <div className="flex items-center gap-[8px] text-gray-700 xl:!text-[18px] xl:!font-bold xl:text-black">
                      {isDesktop && <SchoolIcon size={18} />}
                      <span>지망 대학교</span>
                    </div>
                    <div className="subhead-3 flex flex-col items-end text-black xl:!text-[24px]">
                      <span>{data.choices.length}</span>
                    </div>
                  </div>
                  <div className="flex flex-1 justify-between rounded-[16px] xl:w-[254px] xl:flex-none xl:flex-col xl:bg-white xl:p-[24px]">
                    <div className="flex items-center gap-[8px] text-gray-700 xl:!text-[18px] xl:!font-bold xl:text-black">
                      {isDesktop && <PencilIcon size={18} />}
                      <span>어학 성적</span>
                    </div>
                    <div className="subhead-3 flex flex-col items-end text-black xl:!text-[24px]">
                      <span>{languageCount}</span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex flex-col gap-[20px] xl:grid xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:items-start xl:gap-[24px]">
                <div className="flex flex-col xl:gap-[20px]">
                  <h2 className="border-gray-100 text-[18px] font-bold xl:border-b-1 xl:pb-[20px] xl:text-[20px]">
                    성적 정보
                  </h2>
                  {/* 성적 정보 */}
                  <section className="flex flex-col gap-[8px] border-b border-gray-300 py-[20px] xl:rounded-[16px] xl:border xl:p-[24px]">
                    <h3 className="text-[16px] xl:text-[18px] xl:font-bold">학점</h3>
                    <GradeProgressBar score={data.gpa.score} criteria={data.gpa.criteria} />
                  </section>

                  {/* 어학 */}
                  {languageCount < 0 ? (
                    <section className="flex flex-col gap-[12px] border-b-[8px] border-gray-300 py-[20px] xl:rounded-[16px] xl:border xl:p-[24px]">
                      <h3 className="text-[16px] xl:text-[18px] xl:font-bold">어학</h3>
                      <LanguageChart
                        testType={data.language.testType}
                        score={data.language.score}
                        grade={data.language.grade}
                      />
                    </section>
                  ) : (
                    <section className="flex flex-col gap-[12px] border-b-[8px] border-gray-300 py-[20px] text-gray-700 xl:rounded-[16px] xl:border xl:p-[24px]">
                      <h3 className="text-[16px] xl:text-[18px] xl:font-bold">어학</h3>
                      <p className="body-3 text-gray-700">등록된 어학 성적이 없어요.</p>
                    </section>
                  )}
                </div>

                {/* 지망한 대학교 */}
                <div className="flex flex-col gap-[16px] xl:gap-[20px]">
                  <div className="flex items-center justify-between border-gray-100 xl:border-b-1 xl:pb-[20px]">
                    <h2 className="subhead-2 xl:!text-[20px]">지망한 대학교 ({data.choices.length}개)</h2>
                    <div className="flex items-center justify-between">
                      {isMe && (
                        <Link
                          href={`/strategy-room/${data.seasonId}/applications/re-select-university`}
                          className="cursor-pointer rounded-full bg-gray-300 px-[12px] py-[6px]"
                        >
                          지원 대학교 변경
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-[12px]">
                    {data.choices.map((choiceItem) => (
                      <UniversitySlotCard key={choiceItem.choice} slot={choiceItem.slot} variant="mobile" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
