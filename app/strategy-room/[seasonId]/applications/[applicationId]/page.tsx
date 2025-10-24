"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import GradeProgressBar from "@/components/application/GradeProgressBar";
import LanguageChart from "@/components/application/LanguageChart";
import UniversitySlotCard from "@/components/strategy-room/UniversitySlotCard";
import { getApplicationDetail, getMyApplication } from "@/lib/api/slot";
import { getSeasonSlots } from "@/lib/api/slot";
import { ApplicationDetailResponse, MyApplicationResponse, SeasonSlotsResponse } from "@/types/slot";
import { useAuthStore } from "@/stores/authStore";
import { saveRedirectUrl } from "@/lib/utils/redirect";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const seasonId = parseInt(params.seasonId as string);
  const applicationId = parseInt(params.applicationId as string);
  const { user, isLoggedIn } = useAuthStore();

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
        const [applicationResult, myAppResult, seasonResult] = await Promise.all([
          getApplicationDetail(applicationId),
          getMyApplication(seasonId).catch(() => null),
          getSeasonSlots(seasonId),
        ]);
        setData(applicationResult);
        setMyApplication(myAppResult);
        setSeasonData(seasonResult);
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [applicationId, seasonId]);

  // CTA 버튼 클릭 핸들러 (ShareGradeCTA의 handleClick과 동일한 로직)
  const handleCTAClick = () => {
    const targetUrl = `/strategy-room/${seasonId}/applications/new`;

    // 로그인 확인
    if (!isLoggedIn || !user) {
      // 리다이렉트 URL 저장 후 로그인 페이지로 이동
      saveRedirectUrl(targetUrl);
      router.push("/log-in-or-create-account");
      return;
    }

    // 학교 인증 확인
    if (!user.schoolVerified) {
      // 리다이렉트 URL 저장 후 학교 인증 페이지로 이동
      saveRedirectUrl(targetUrl);
      router.push("/school-verification");
      return;
    }

    // 모두 완료된 경우 바로 이동
    router.push(targetUrl);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">{error || "데이터를 찾을 수 없습니다."}</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <Header title={isMe ? "내 프로필" : "프로필"} showPrevButton />

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

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col gap-[24px] p-[20px]">
        {/* 상단 요약 */}
        <div className="flex flex-col gap-[12px] rounded-[12px] bg-white p-[20px] shadow-sm">
          {/* 닉네임 + ME 배지 */}
          <div className="flex items-center gap-[8px]">
            <h1 className="text-[24px] font-bold">{data.nickname}</h1>
            {isMe && (
              <span className="rounded-[4px] bg-[#056DFF] px-[6px] py-[2px] text-[11px] font-bold text-white">ME</span>
            )}
          </div>

          {/* 지망 대학교 / 어학 성적 개수 */}
          <div className="flex items-center gap-[24px] text-[14px] text-gray-600">
            <div>
              지망 대학교 <span className="font-bold text-black">{data.choices.length}</span>
            </div>
            <div>
              어학 성적 <span className="font-bold text-black">1</span>
            </div>
          </div>
        </div>

        {/* 성적 정보 */}
        <div className="flex flex-col gap-[20px] rounded-[12px] bg-white p-[20px] shadow-sm">
          <h2 className="text-[18px] font-bold">성적 정보</h2>

          {/* 학점 */}
          <div className="flex flex-col gap-[12px]">
            <h3 className="text-[14px] font-medium text-gray-700">학점</h3>
            <GradeProgressBar score={data.gpa.score} criteria={data.gpa.criteria} />
          </div>

          {/* 어학 */}
          <div className="flex flex-col gap-[12px]">
            <h3 className="text-[14px] font-medium text-gray-700">어학</h3>
            <div className="flex justify-start gap-[24px] py-[12px]">
              <LanguageChart testType={data.language.testType} score={data.language.score} />
            </div>
          </div>
        </div>

        {/* 지망한 대학교 */}
        <div className="flex flex-col gap-[16px] rounded-[12px] bg-white p-[20px] shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold">지망한 대학교 ({data.choices.length}개)</h2>
            {isMe && (
              <button className="rounded-[6px] bg-gray-100 px-[12px] py-[6px] text-[12px] text-gray-700 hover:bg-gray-200">
                지원 대학교 변경
              </button>
            )}
          </div>

          <div className="flex flex-col gap-[12px]">
            {data.choices.map((choiceItem) => (
              <UniversitySlotCard key={choiceItem.choice} slot={choiceItem.slot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
