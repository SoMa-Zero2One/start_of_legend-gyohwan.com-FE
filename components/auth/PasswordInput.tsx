"use client";

import { useState } from "react";
import EyeOpenIcon from "@/components/icons/EyeOpenIcon";
import EyeClosedIcon from "@/components/icons/EyeClosedIcon";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  showValidation?: boolean;
  validationMessage?: string;
  isValid?: boolean;
  showTooltip?: boolean;
  tooltipMessage?: string;
}

export default function PasswordInput({
  value,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  placeholder,
  disabled = false,
  showValidation = false,
  validationMessage,
  isValid,
  showTooltip = false,
  tooltipMessage,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  // 에러 상태: 검증이 표시되고, 유효하지 않고, 메시지가 있을 때
  const hasError = showValidation && isValid === false && validationMessage;
  // 성공 상태: 검증이 표시되고, 유효하고, 메시지가 있을 때
  const hasSuccess = showValidation && isValid === true && validationMessage;

  return (
    <div className="relative">
      {/* 말풍선 (옵션) */}
      {showTooltip && tooltipMessage && (
        <div
          className={`absolute -top-[50px] z-10 w-full text-center duration-300 ${
            isFocused ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="caption-2 inline-block rounded-md bg-black px-4 py-2 text-white">{tooltipMessage}</div>
          <div className="absolute -bottom-[5px] left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-t-black border-r-transparent border-l-transparent" />
        </div>
      )}

      {/* 입력칸 */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`w-full rounded-[4px] border p-3 pr-12 focus:outline-none ${
            !value
              ? "border-gray-300"
              : hasError
                ? "ring-error-red border-transparent ring-2"
                : hasSuccess
                  ? "ring-primary-blue border-transparent ring-2"
                  : "border-gray-300"
          }`}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOpenIcon size={20} className="cursor-pointer" />
          ) : (
            <EyeClosedIcon size={20} className="cursor-pointer" />
          )}
        </button>
      </div>

      {/* 검증 메시지 */}
      {hasError && <p className="caption-2 text-error-red mt-1">{validationMessage}</p>}
      {hasSuccess && <p className="caption-2 mt-1 text-green-500">{validationMessage}</p>}
    </div>
  );
}
