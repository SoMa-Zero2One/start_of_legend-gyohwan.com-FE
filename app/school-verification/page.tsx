"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import EmailStep from "@/components/school-verification/EmailStep";
import VerificationStep from "@/components/school-verification/VerificationStep";
import { sendSchoolEmailVerification, confirmSchoolEmailVerification } from "@/lib/api/user";
import { handleApiError } from "@/lib/utils/apiError";
import { trackEvent } from "@/lib/analytics/gtag";
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
  const hasTrackedStartRef = useRef(false);

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

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || !user) return;
    if (hasTrackedStartRef.current) return;

    const didTrack = trackEvent("school_verification_start", {
      page_path: "/school-verification",
    });
    if (didTrack) {
      hasTrackedStartRef.current = true;
    }
  }, [authLoading, isLoggedIn, user]);

  const reportVerificationError = (currentStep: Step, errorCode: string) => {
    trackEvent("school_verification_error", {
      step: currentStep,
      error_code: errorCode,
    });
  };

  // Step 1: 학교 이메일 입력 후 인증 코드 발송
  const handleEmailSubmit = async (schoolEmail: string) => {
    setError("");
    setIsLoading(true);

    try {
      trackEvent("school_verification_email_submit", {});
      await sendSchoolEmailVerification(schoolEmail);
      setEmail(schoolEmail);
      // URL 업데이트로 step 변경
      router.push("/school-verification?step=verification");
    } catch (error) {
      console.error("School email verification error:", error);
      const errorMessage = handleApiError(error);
      reportVerificationError("email", "send_email_failed");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: 인증 코드 확인
  const handleCodeVerify = async (code: string) => {
    setError("");
    setIsLoading(true);

    try {
      trackEvent("school_verification_code_submit", {});
      await confirmSchoolEmailVerification(email, code);

      // 사용자 정보 업데이트 (schoolVerified = true로 변경됨)
      await fetchUser();
      trackEvent("school_verification_complete", {});

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
    } catch (error) {
      console.error("Code verification error:", error);
      const errorMessage = handleApiError(error);
      reportVerificationError("verification", "verify_code_failed");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 재전송
  const handleResendEmail = async () => {
    setError("");
    setIsLoading(true);

    try {
      trackEvent("school_verification_resend", {});
      await sendSchoolEmailVerification(email);
    } catch (error) {
      console.error("Resend email error:", error);
      const errorMessage = handleApiError(error);
      reportVerificationError("verification", "resend_email_failed");
      setError(errorMessage);
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
      <div className="flex flex-1 flex-col items-center justify-between pt-[60px] pb-[36px] md:pt-[100px] xl:pt-[80px]">
        <div className="flex w-full flex-col items-center gap-[60px] px-[20px]">
          {/* 헤더 */}
          <div className="text-center">
            <h1 className="head-4 md:!text-[36px]">{headerContent[step].title}</h1>
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
