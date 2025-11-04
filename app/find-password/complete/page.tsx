"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";

function CompletePasswordResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");

  // 이메일 가져오기
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const emailFromStorage = sessionStorage.getItem("pendingEmail");
    const finalEmail = emailFromUrl || emailFromStorage || "";

    setEmail(finalEmail);

    // sessionStorage 정리
    sessionStorage.removeItem("pendingEmail");
  }, [searchParams]);

  // 로그인 페이지로 이동
  const handleGoToLogin = () => {
    if (email) {
      router.push(`/log-in/password?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/log-in-or-create-account");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="비밀번호 찾기" showPrevButton showBorder />
      <div className="flex flex-1 flex-col items-center px-[20px] pt-[60px]">
        <div className="flex w-[330px] flex-col items-center gap-[60px]">
          {/* 헤더 */}
          <div className="text-center">
            <h1 className="head-4">비밀번호가 재설정 되었습니다</h1>
            <p className="body-2 mt-[12px] text-gray-900">새로운 비밀번호로 로그인해주세요.</p>
          </div>

          {/* 버튼 영역 */}
          <button onClick={handleGoToLogin} className="btn-secondary w-full cursor-pointer rounded-[4px] p-[12px]">
            로그인 하러가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CompletePasswordReset() {
  return (
    <Suspense fallback={null}>
      <CompletePasswordResetContent />
    </Suspense>
  );
}
