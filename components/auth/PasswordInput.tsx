'use client';

import { useState } from 'react';

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
          className={`absolute w-full -top-[50px] text-center transition-opacity duration-300 z-10 ${
            isFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="bg-black text-white text-[12px] py-2 px-4 rounded-md inline-block">
            {tooltipMessage}
          </div>
          <div
            className="absolute left-1/2 -bottom-[5px] -translate-x-1/2 w-0 h-0
                          border-l-8 border-l-transparent border-r-8 border-r-transparent
                          border-t-8 border-t-black"
          />
        </div>
      )}

      {/* 입력칸 */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 border rounded-lg
                     focus:outline-none transition-all
                     ${!value
                       ? 'border-gray-300'
                       : hasError
                       ? 'border-transparent ring-2 ring-[#FF4242]'
                       : hasSuccess
                       ? 'border-transparent ring-2 ring-[#056DFF]'
                       : 'border-gray-300'
                     }`}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {showPassword ? (
            // 눈 열림 (비밀번호 보임)
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            // 눈 감김 (비밀번호 숨김)
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          )}
        </button>
      </div>

      {/* 검증 메시지 */}
      {hasError && (
        <p className="text-[#FF4242] text-xs mt-1">{validationMessage}</p>
      )}
      {hasSuccess && (
        <p className="text-green-500 text-xs mt-1">{validationMessage}</p>
      )}
    </div>
  );
}
