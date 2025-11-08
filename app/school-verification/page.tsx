"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import EmailStep from "@/components/school-verification/EmailStep";
import VerificationStep from "@/components/school-verification/VerificationStep";
import { sendSchoolEmailVerification, confirmSchoolEmailVerification } from "@/lib/api/user";
import { getRedirectUrl, clearRedirectUrl, saveRedirectUrl } from "@/lib/utils/redirect";
import { useAuthStore } from "@/stores/authStore";
import TermsAgreement from "@/components/auth/TermsAgreement";

type Step = "email" | "verification";

function SchoolVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, user, fetchUser, isLoading: authLoading } = useAuthStore();

  // URL 쿼리 파라미터에서 step 읽기
  const step = (searchParams.get("step") as Step) || "email";

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 체크: 로그인되지 않은 경우 리다이렉트
  useEffect(() => {
    // authStore 로딩 완료 후에만 체크
    if (authLoading) return;

    if (!isLoggedIn || !user) {
      const currentUrl = "/school-verification";
      saveRedirectUrl(currentUrl);
      router.replace("/log-in-or-create-account");
    }
  }, [isLoggedIn, user, router, authLoading]);

  // Step 1: 학교 이메일 입력 후 인증 코드 발송
  const handleEmailSubmit = async (schoolEmail: string) => {
    setError("");
    setIsLoading(true);

    try {
      await sendSchoolEmailVerification(schoolEmail);
      setEmail(schoolEmail);
      // URL 업데이트로 step 변경
      router.push("/school-verification?step=verification");
    } catch (err) {
      console.error("School email verification error:", err);
      setError("인증 메일 발송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: 인증 코드 확인
  const handleCodeVerify = async (code: string) => {
    setError("");
    setIsLoading(true);

    try {
      await confirmSchoolEmailVerification(email, code);

      // 사용자 정보 업데이트 (schoolVerified = true로 변경됨)
      await fetchUser();

      // 리다이렉트 URL 확인
      const redirectUrl = getRedirectUrl();

      if (redirectUrl) {
        // 목적지로 이동
        clearRedirectUrl();
        router.push(redirectUrl);
      } else {
        // redirectUrl 없으면 홈으로
        router.push("/");
      }
    } catch (err) {
      console.error("Code verification error:", err);
      setError("인증 코드가 올바르지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 재전송
  const handleResendEmail = async () => {
    setError("");
    setIsLoading(true);

    try {
      await sendSchoolEmailVerification(email);
    } catch (err) {
      console.error("Resend email error:", err);
      setError("이메일 재전송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const headerContent = {
    email: {
      title: "학교 인증",
      subtitle: "사용하는 대학교 이메일 주소를 입력하세요.",
    },
    verification: {
      title: "받은 편지함을 확인하세요",
      subtitle: `받은 이메일에 인증 메일이 없다면\n스팸 메일함을 확인해주세요.`,
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="학교 인증" showPrevButton showHomeButton showBorder />
      <div className="flex flex-1 flex-col items-center justify-between px-[20px] pt-[60px] pb-[36px]">
        <div className="flex w-[330px] flex-col items-center gap-[60px]">
          {/* 헤더 */}
          <div className="text-center">
            <h1 className="head-4">{headerContent[step].title}</h1>
            <p className="body-2 mt-[12px]">{headerContent[step].subtitle}</p>
          </div>

          {/* Step 컴포넌트 */}
          {step === "email" && (
            <EmailStep
              onSubmit={handleEmailSubmit}
              error={error}
              isLoading={isLoading}
              onErrorClear={() => setError("")}
            />
          )}
          {step === "verification" && (
            <VerificationStep
              onVerify={handleCodeVerify}
              onResend={handleResendEmail}
              error={error}
              isLoading={isLoading}
            />
          )}
        </div>
        <TermsAgreement />
      </div>
    </div>
  );
}

export default function SchoolVerification() {
  return (
    <Suspense fallback={null}>
      <SchoolVerificationContent />
    </Suspense>
  );
}
