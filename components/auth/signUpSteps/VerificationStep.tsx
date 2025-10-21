"use client";

import { useState, useEffect } from "react";

interface VerificationStepProps {
  onVerify: (code: string) => void;
  onResend: () => void;
  error: string;
  isLoading: boolean;
}

export default function VerificationStep({ onVerify, onResend, error, isLoading }: VerificationStepProps) {
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5분 = 300초

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && code.length === 6 && !isLoading) onVerify(code);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(val);
  };

  const handleResend = () => {
    setTimeLeft(300);
    onResend();
  };

  return (
    <div className="flex flex-col items-center gap-[30px]">
      {/* 입력 영역 */}
      <div className={`w-full ${isLoading ? "pointer-events-none cursor-not-allowed opacity-50" : ""}`}>
        <div className="relative mb-[8px]">
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            placeholder="코드"
            maxLength={6}
            disabled={isLoading || timeLeft <= 0}
            className={`h-[56px] w-full rounded-[4px] border px-4 pr-[60px] focus:outline-none ${
              error || timeLeft <= 0 ? "border-error-red" : "border-gray-300"
            } disabled:text-gray-500`}
          />
          <span className="text-error-red absolute top-1/2 right-4 -translate-y-1/2">
            {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
          </span>
        </div>

        {/* 에러 메시지 */}
        {error && <p className="text-error-red">{error}</p>}

        {/* 계속 버튼 */}
        <button
          onClick={() => onVerify(code)}
          disabled={code.length !== 6 || timeLeft <= 0}
          className="btn-primary mt-[12px]"
        >
          계속
        </button>
      </div>

      {/* 이메일 다시 보내기 */}
      <button
        onClick={handleResend}
        disabled={isLoading}
        className="cursor-pointer text-black hover:underline disabled:cursor-default disabled:text-gray-700"
      >
        {isLoading ? "전송 중..." : "이메일 다시 보내기"}
      </button>
    </div>
  );
}
