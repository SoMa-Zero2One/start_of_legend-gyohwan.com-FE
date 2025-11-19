"use client";

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeaderAuthSection from "@/components/layout/HeaderAuthSection";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * USAGE: /community/** 경로에서 에러 발생 시 표시
 *
 * WHAT: 커뮤니티 관련 페이지의 에러 바운더리
 *
 * WHY:
 * - parseApiError로 생성한 한글 에러 메시지를 사용자에게 표시
 * - 500, 네트워크 에러 등을 사용자 친화적으로 안내
 * - reset() 함수로 재시도 기능 제공
 * - Next.js 기본 에러 페이지보다 나은 UX
 *
 * ALTERNATIVES:
 * - Next.js 기본 에러 페이지 사용 (rejected: 개발자 친화적, 사용자 비친화적)
 * - 루트 error.tsx 사용 (rejected: 커뮤니티만의 컨텍스트 필요)
 *
 * @param error - 에러 객체 (error.message에 parseApiError 결과 포함)
 * @param reset - 페이지 재시도 함수
 */
export default function CommunityError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (개발 환경에서 디버깅용)
    console.error("[CommunityError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white">
        <Header showPrevButton showHomeButton>
          <HeaderAuthSection />
        </Header>
      </div>

      <main className="mx-auto flex w-full max-w-[430px] flex-1 flex-col items-center justify-center px-[20px]">
        <div className="flex flex-col items-center text-center">
          {/* 에러 아이콘 */}
          <div className="mb-[24px] flex h-[80px] w-[80px] items-center justify-center rounded-full bg-gray-100">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* 에러 메시지 */}
          <h1 className="subhead-1 mb-[8px] text-gray-900">문제가 발생했습니다</h1>
          <p className="body-2 mb-[32px] text-gray-700">
            {error.message || "알 수 없는 오류가 발생했습니다."}
          </p>

          {/* 액션 버튼 */}
          <div className="flex w-full flex-col gap-[12px]">
            <button
              onClick={reset}
              className="btn-primary body-1 w-full cursor-pointer rounded-[4px] py-[12px]"
            >
              다시 시도
            </button>
            <button
              onClick={() => (window.location.href = "/community")}
              className="btn-secondary body-1 w-full cursor-pointer rounded-[4px] py-[12px]"
            >
              커뮤니티 홈으로
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
