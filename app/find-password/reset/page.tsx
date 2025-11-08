"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmPasswordReset, requestPasswordReset } from "@/lib/api/auth";
import { handleApiError } from "@/lib/utils/apiError";
import Header from "@/components/layout/Header";
import TermsAgreement from "@/components/auth/TermsAgreement";
import PasswordInput from "@/components/auth/PasswordInput";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordConfirmFocused, setPasswordConfirmFocused] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // 이메일 가져오기
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

  // 비밀번호 유효성 검증
  const isValidPassword = (password: string): boolean => {
    return password.length >= 12;
  };

  // 인증번호 입력 핸들러 (숫자만 6자리)
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(val);
  };

  // 제출 가능 여부
  const isSubmitEnabled =
    code.length === 6 &&
    password.length > 0 &&
    passwordConfirm.length > 0 &&
    isValidPassword(password) &&
    password === passwordConfirm &&
    !isLoading;

  // 비밀번호 재설정 제출
  const handleSubmit = async () => {
    if (!isSubmitEnabled) return;

    setError("");
    setIsLoading(true);

    try {
      // 비밀번호 재설정 확인 API 호출
      await confirmPasswordReset(email, code, password);

      // 성공 시 완료 페이지로 이동
      router.push(`/find-password/complete?email=${encodeURIComponent(email)}`);
    } catch (error) {
      // 모든 에러 타입 처리 (네트워크 에러, API 에러 등)
      const errorMessage = handleApiError(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isSubmitEnabled) {
      handleSubmit();
    }
  };

  // 인증번호 재전송
  const handleResendCode = async () => {
    setError("");
    setIsResending(true);

    try {
      await requestPasswordReset(email);
      alert("인증번호가 재전송되었습니다.");
    } catch (error) {
      // 모든 에러 타입 처리 (네트워크 에러, API 에러 등)
      const errorMessage = handleApiError(error);
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="비밀번호 찾기" showPrevButton showHomeButton />
      <div className="flex flex-1 flex-col items-center justify-between pt-[60px] pb-[36px]">
        <div className="flex w-full flex-col items-center px-[20px]">
          <div className="flex w-[330px] flex-col justify-center gap-[60px]">
            {/* 헤더 */}
            <div className="text-center">
              <h1 className="head-4">비밀번호를 설정하세요</h1>
            </div>

            {/* 입력 영역 */}
            <div className="flex flex-col gap-[10px]">
              {/* 이메일 표시 */}
              <div className="mb-[10px] rounded-[4px] bg-gray-100 p-3">
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-transparent text-gray-700 outline-none"
                />
              </div>

              {/* 인증번호 입력 */}
              <div className="flex flex-col gap-[4px]">
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={handleCodeChange}
                    onKeyDown={handleKeyDown}
                    placeholder="인증번호 6자리"
                    maxLength={6}
                    disabled={isLoading}
                    className="h-[48px] w-full rounded-[4px] border border-gray-300 px-4 py-3 pr-[80px] focus:outline-none"
                  />
                  {/* 재전송 버튼 (입력 필드 내부) */}
                  <button
                    onClick={handleResendCode}
                    disabled={isResending || isLoading}
                    className="caption-2 text-primary-blue absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer hover:underline disabled:cursor-default disabled:text-gray-400"
                  >
                    {isResending ? "전송 중" : "재전송"}
                  </button>
                </div>

                {/* 안내 문구 */}
                <p className="caption-2 px-[4px] text-gray-700">이메일로 전송된 인증번호를 입력하세요 (10분 유효)</p>
              </div>

              {/* 비밀번호 입력 */}
              <PasswordInput
                value={password}
                onChange={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="비밀번호"
                disabled={isLoading}
                showTooltip={false}
                showValidation={password.length > 0}
                isValid={isValidPassword(password)}
                validationMessage={
                  !isValidPassword(password)
                    ? `비밀번호는 12글자 이상이어야 합니다. (현재: ${password.length}글자)`
                    : passwordFocused
                      ? "✓ 사용 가능한 비밀번호입니다."
                      : undefined
                }
              />

              {/* 비밀번호 확인 입력 */}
              <PasswordInput
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                onFocus={() => setPasswordConfirmFocused(true)}
                onBlur={() => setPasswordConfirmFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="비밀번호 확인"
                disabled={isLoading}
                showTooltip={false}
                showValidation={passwordConfirm.length > 0}
                isValid={isValidPassword(password) && password === passwordConfirm}
                validationMessage={
                  !isValidPassword(password)
                    ? undefined
                    : password !== passwordConfirm
                      ? "비밀번호가 일치하지 않습니다."
                      : passwordConfirmFocused
                        ? "✓ 비밀번호가 일치합니다."
                        : undefined
                }
              />

              {/* 에러 메시지 */}
              {error && <p className="text-error-red">{error}</p>}

              {/* 계속 버튼 */}
              <button
                onClick={handleSubmit}
                disabled={!isSubmitEnabled}
                className="btn-secondary mt-[10px] w-full cursor-pointer rounded-[4px] p-[12px]"
              >
                {isLoading ? "재설정 중..." : "계속"}
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

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
