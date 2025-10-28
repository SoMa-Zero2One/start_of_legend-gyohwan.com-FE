"use client";

import { useState } from "react";
import PasswordInput from "../PasswordInput";

interface PasswordStepProps {
  email: string;
  password: string;
  passwordConfirm: string;
  onPasswordChange: (value: string) => void;
  onPasswordConfirmChange: (value: string) => void;
  onEdit: () => void;
  onSubmit: () => void;
  error: string;
  isLoading: boolean;
}

export default function PasswordStep({
  email,
  password,
  passwordConfirm,
  onPasswordChange,
  onPasswordConfirmChange,
  onEdit,
  onSubmit,
  error,
  isLoading,
}: PasswordStepProps) {
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordConfirmFocused, setPasswordConfirmFocused] = useState(false);

  // 비밀번호 유효성 검증
  const isValidPassword = (password: string): boolean => {
    return password.length >= 12;
  };

  // 버튼 활성화 조건
  const isSubmitEnabled =
    password.length > 0 &&
    passwordConfirm.length > 0 &&
    isValidPassword(password) &&
    password === passwordConfirm &&
    !isLoading;

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isSubmitEnabled) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {/* 이메일 표시 */}
      <div className="mb-[10px] flex items-center gap-2 rounded-[4px] bg-gray-100 p-3">
        <input type="email" value={email} disabled className="flex-1 bg-transparent text-gray-700 outline-none" />
        <button onClick={onEdit} className="text-primary-blue hover:text-blue-700">
          편집
        </button>
      </div>

      {/* 비밀번호 입력 */}
      <PasswordInput
        value={password}
        onChange={onPasswordChange}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder="비밀번호"
        disabled={isLoading}
        showTooltip={true}
        tooltipMessage="비밀번호는 12글자 이상으로 설정해주세요!"
        showValidation={password.length > 0}
        isValid={isValidPassword(password)}
        validationMessage={
          !isValidPassword(password)
            ? `비밀번호는 12글자 이상이어야 합니다. (현재: ${password.length}글자)`
            : passwordFocused
              ? "✓ 사용 가능한 비밀번호입니다."
              : undefined
        }
        autoFocus={true}
      />

      {/* 비밀번호 확인 입력 */}
      <PasswordInput
        value={passwordConfirm}
        onChange={onPasswordConfirmChange}
        onFocus={() => setPasswordConfirmFocused(true)}
        onBlur={() => setPasswordConfirmFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder="비밀번호 확인"
        disabled={isLoading}
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
      <button onClick={onSubmit} disabled={!isSubmitEnabled} className="btn-secondary w-full rounded-[4px] p-[12px]">
        {isLoading ? "처리 중..." : "계속"}
      </button>
    </div>
  );
}
