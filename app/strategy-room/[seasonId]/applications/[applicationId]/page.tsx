"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import GradeProgressBar from "@/components/application/GradeProgressBar";
import LanguageChart from "@/components/application/LanguageChart";
import UniversitySlotCard from "@/components/strategy-room/UniversitySlotCard";
import { getApplicationDetail, getMyApplication } from "@/lib/api/slot";
import { getSeasonSlots } from "@/lib/api/slot";
import { ApplicationDetailResponse, MyApplicationResponse, SeasonSlotsResponse } from "@/types/slot";

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

  const isMe = myApplication?.applicationId === applicationId;
  const hasApplied = seasonData?.hasApplied ?? false;

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
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("데이터를 불러오는데 실패했습니다.");
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
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/95">
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
          <Header title={isMe ? "내 프로필" : "프로필"} showPrevButton showHomeButton />
          <div className="flex flex-col px-[20px]">
            {/* 상단 요약 */}
            <div className="flex flex-col gap-[20px] border-b-[8px] border-gray-300 py-[20px]">
              {/* 닉네임 + ME 배지 */}
              <div className="flex gap-[4px]">
                <h1 className="text-[24px] font-bold">{data.nickname}</h1>
                <div className="flex items-start">
                  {isMe && (
                    <span className="bg-primary-blue rounded-full px-[6px] py-[2px] text-[10px] font-bold text-white">
                      ME
                    </span>
                  )}
                </div>
              </div>

              {/* 지망 대학교 / 어학 성적 개수 */}
              <div className="flex items-center gap-[24px] text-[14px] text-gray-700">
                <div className="flex flex-1 justify-between">
                  지망 대학교 <span className="subhead-3 text-black">{data.choices.length}</span>
                </div>
                <div className="flex flex-1 justify-between">
                  어학 성적 <span className="subhead-3 text-black">1</span>
                </div>
              </div>
            </div>

            {/* 성적 정보 */}
            <div className="flex flex-col gap-[16px] border-b border-gray-300 py-[20px]">
              <h2 className="text-[18px] font-bold">성적 정보</h2>

              {/* 학점 */}
              <div className="flex flex-col gap-[8px]">
                <h3>학점</h3>
                <GradeProgressBar score={data.gpa.score} criteria={data.gpa.criteria} />
              </div>
            </div>
            <div className="flex flex-col border-b-[8px] border-gray-300 py-[20px]">
              {/* 어학 */}
              <div className="flex flex-col gap-[12px]">
                <h3 className="text-[14px] font-medium text-gray-700">어학</h3>
                <LanguageChart
                  testType={data.language.testType}
                  score={data.language.score}
                  grade={data.language.grade}
                />
              </div>
            </div>

            {/* 지망한 대학교 */}
            <div className="flex flex-col gap-[16px] py-[20px]">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-bold">지망한 대학교 ({data.choices.length}개)</h2>
                {isMe && (
                  <Link
                    href={`/strategy-room/${data.seasonId}/applications/re-select-university`}
                    className="cursor-pointer rounded-full bg-gray-300 px-[12px] py-[6px] text-[12px]"
                  >
                    지원 대학교 변경
                  </Link>
                )}
              </div>

              <div className="flex flex-col gap-[12px]">
                {data.choices.map((choiceItem) => (
                  <UniversitySlotCard key={choiceItem.choice} slot={choiceItem.slot} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
