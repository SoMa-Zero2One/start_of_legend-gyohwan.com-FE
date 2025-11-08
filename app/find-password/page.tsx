"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestPasswordReset } from "@/lib/api/auth";
import { handleApiError } from "@/lib/utils/apiError";
import Header from "@/components/layout/Header";
import TermsAgreement from "@/components/auth/TermsAgreement";

function FindPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 이메일 가져오기 (URL 파라미터 우선, 없으면 SessionStorage)
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const emailFromStorage = sessionStorage.getItem("pendingEmail");
    const finalEmail = emailFromUrl || emailFromStorage || "";

    if (!finalEmail) {
      // 이메일이 없으면 로그인 페이지로 리다이렉트
      router.push("/log-in-or-create-account");
      return;
    }

    setEmail(finalEmail);
  }, [searchParams, router]);

  // 계속 버튼 클릭 (인증번호 요청)
  const handleContinue = async () => {
    if (!email) return;

    setError("");
    setIsLoading(true);

    try {
      // 비밀번호 재설정 요청 API 호출
      await requestPasswordReset(email);

      // 성공 시 다음 페이지로 이동
      router.push(`/find-password/reset?email=${encodeURIComponent(email)}`);
    } catch (error) {
      // 모든 에러 타입 처리 (네트워크 에러, API 에러 등)
      const errorMessage = handleApiError(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인으로 돌아가기
  const handleBackToLogin = () => {
    router.push(`/log-in/password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="비밀번호 찾기" showPrevButton showHomeButton />
      <div className="flex flex-1 flex-col items-center justify-between pt-[60px] pb-[36px]">
        <div className="flex w-full flex-col items-center px-[20px]">
          <div className="flex w-[330px] flex-col justify-center gap-[60px]">
            {/* 헤더 */}
            <div className="text-center">
              <h1 className="head-4">비밀번호를 잊으셨나요?</h1>
              <p className="body-2 mt-[12px] text-gray-900">비밀번호를 초기화하려면 &quot;계속&quot;을 클릭하세요.</p>
            </div>

            {/* 버튼 영역 */}
            <div className="flex flex-col gap-[20px]">
              {/* 에러 메시지 */}
              {error && <p className="text-error-red text-center">{error}</p>}

              {/* 계속 버튼 */}
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="btn-secondary w-full cursor-pointer rounded-[4px] p-[12px]"
              >
                {isLoading ? "요청 중..." : "계속"}
              </button>

              {/* 로그인으로 돌아가기 */}
              <button onClick={handleBackToLogin} className="body-2 cursor-pointer text-center hover:underline">
                로그인으로 돌아가기
              </button>
            </div>
          </div>
        </div>

        {/* 약관 동의 */}
        <TermsAgreement />
      </div>
    </div>
  );
}

export default function FindPassword() {
  return (
    <Suspense fallback={null}>
      <FindPasswordContent />
    </Suspense>
  );
}
