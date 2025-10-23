"use client";

import { useState } from "react";

interface EmailStepProps {
  onSubmit: (email: string) => void;
  error: string;
  isLoading: boolean;
}

export default function EmailStep({ onSubmit, error, isLoading }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);

  // 이메일 형식 검증
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // 입력 도중에도 실시간으로 이메일 형식 검증
    if (newEmail && !isValidEmail(newEmail)) {
      setShowEmailError(true);
    } else {
      setShowEmailError(false);
    }
  };

  const handleSubmit = () => {
    if (!isValidEmail(email)) {
      setShowEmailError(true);
      return;
    }
    onSubmit(email);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && email && isValidEmail(email) && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className={`relative w-full space-y-3 duration-300 ${isFocused ? "mt-0" : "mt-9"}`}>
      {/* 이메일 입력 영역 */}
      <div className="relative">
        {/* 말풍선 */}
        <div
          className={`absolute -top-full w-full text-center duration-300 ${isFocused ? "opacity-0" : "opacity-100"}`}
        >
          <div className="caption-2 rounded-[4px] bg-black px-4 py-2 text-white">
            일반 이메일 주소가 아닌 학교 이메일 주소를 입력해 주세요!
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
          disabled={isLoading}
          className={`h-[48px] w-full rounded-[4px] border px-4 py-3 focus:outline-none ${
            !email
              ? "border-gray-300"
              : showEmailError
                ? "ring-error-red border-transparent ring-2"
                : "ring-primary-blue border-transparent ring-2"
          }`}
        />
      </div>

      {/* 에러 메시지 */}
      {showEmailError && <p className="text-error-red text-sm">올바른 이메일을 입력해주세요!</p>}
      {error && <p className="text-error-red text-sm">{error}</p>}

      {/* 계속 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!email || !isValidEmail(email) || isLoading}
        className="btn-secondary w-full rounded-[4px] p-[12px]"
      >
        {isLoading ? "전송 중..." : "계속"}
      </button>
    </div>
  );
}
