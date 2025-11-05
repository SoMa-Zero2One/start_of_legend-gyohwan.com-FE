"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkEmailExists } from "@/lib/api/auth";

export default function EmailLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);

  // 이메일 형식 검증
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setError("");

    // 입력 도중에도 실시간으로 이메일 형식 검증
    if (newEmail && !isValidEmail(newEmail)) {
      setShowEmailError(true);
    } else {
      setShowEmailError(false);
    }
  };

  const handleClick = async () => {
    setError("");

    // 이메일 형식 검증
    if (!isValidEmail(email)) {
      setShowEmailError(true);
      return;
    }

    setIsLoading(true);

    try {
      // 이메일 존재 여부 확인
      const emailExists = await checkEmailExists(email);

      // SessionStorage에 이메일 저장 (새로고침 대응)
      sessionStorage.setItem("pendingEmail", email);

      // 회원가입 여부에 따라 페이지 이동 (URL 파라미터도 함께 전달)
      if (emailExists) {
        // 기존 회원 → 로그인 페이지
        router.push(`/log-in/password?email=${encodeURIComponent(email)}`);
      } else {
        // 신규 회원 → 회원가입 페이지
        router.push(`/create-account/password?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      // 서버에서 받은 에러 메시지 표시
      const errorMessage = (error as Error).message;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && email && isValidEmail(email) && !isLoading) {
      handleClick();
    }
  };

  return (
    <div className={`relative space-y-3 duration-300 ${isFocused ? "mt-0" : "mt-9"}`}>
      {/* 이메일 입력 영역 */}
      <div className="relative">
        {/* 말풍선 */}
        <div
          className={`absolute -top-full w-full text-center duration-300 ${isFocused ? "opacity-0" : "opacity-100"}`}
        >
          <div className="caption-2 rounded-[4px] bg-black px-4 py-2 text-white">
            학교 이메일로 로그인 시 학교 인증도 같이 진행할 수 있어요!
          </div>
          <div className="absolute -bottom-[5px] left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-t-black border-r-transparent border-l-transparent" />
        </div>

        {/* 이메일 입력창 */}
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="이메일 주소를 입력하세요"
          className={`h-[48px] w-full rounded-[4px] border px-4 py-3 focus:outline-none ${
            !email
              ? "border-gray-300"
              : showEmailError
                ? "ring-error-red border-transparent ring-2"
                : "ring-primary-blue border-transparent ring-2"
          }`}
          disabled={isLoading}
        />
      </div>

      {/* 에러 메시지 */}
      {showEmailError && <p className="text-error-red text-sm">올바른 이메일을 입력해주세요!</p>}
      {error && <p className="text-error-red text-sm">{error}</p>}

      {/* 계속 버튼 */}
      <button
        onClick={handleClick}
        disabled={!email || !isValidEmail(email) || isLoading}
        className="btn-secondary w-full rounded-[4px] p-[12px]"
      >
        {isLoading ? "확인 중..." : "계속"}
      </button>
    </div>
  );
}
