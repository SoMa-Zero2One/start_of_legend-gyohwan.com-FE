'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkEmailExists } from '@/lib/api/auth';

export default function EmailLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
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
    setError('');

    // 입력 도중에도 실시간으로 이메일 형식 검증
    if (newEmail && !isValidEmail(newEmail)) {
      setShowEmailError(true);
    } else {
      setShowEmailError(false);
    }
  };

  const handleClick = async () => {
    setError('');

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
      sessionStorage.setItem('pendingEmail', email);

      // 회원가입 여부에 따라 페이지 이동 (URL 파라미터도 함께 전달)
      if (emailExists) {
        // 기존 회원 → 로그인 페이지
        router.push(`/log-in/password?email=${encodeURIComponent(email)}`);
      } else {
        // 신규 회원 → 회원가입 페이지
        router.push(`/create-account/password?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      console.error('Email check error:', err);
      setError('이메일 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && email && isValidEmail(email) && !isLoading) {
      handleClick();
    }
  };

  return (
    <div className={`relative space-y-3 transition-all duration-300 ${isFocused ? 'mt-0' : 'mt-9'}`}>
      {/* 이메일 입력 영역 */}
      <div className="relative">
        {/* 말풍선 */}
        <div
          className={`absolute w-full -top-full text-center transition-opacity duration-300 ${
            isFocused ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="bg-black text-white text-[12px] py-2 px-4 rounded-[4px]">
            학교 이메일로 로그인 시 학교 인증도 같이 진행할 수 있어요!
          </div>
          <div className="absolute left-1/2 -bottom-[5px] -translate-x-1/2 w-0 h-0
                          border-l-8 border-l-transparent border-r-8 border-r-transparent
                          border-t-8 border-t-black" />
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
          className={`w-full h-[48px] px-4 py-3 border rounded-[4px]
                     focus:outline-none transition-all
                     ${!email
                       ? 'border-gray-300'
                       : showEmailError
                       ? 'border-transparent ring-2 ring-[#FF4242]'
                       : 'border-transparent ring-2 ring-[#056DFF]'}`}
          disabled={isLoading}
        />
      </div>

      {/* 에러 메시지 */}
      {showEmailError && (
        <p className="text-[#FF4242] text-sm">올바른 이메일을 입력해주세요!</p>
      )}
      {error && (
        <p className="text-[#FF4242] text-sm">{error}</p>
      )}

      {/* 계속 버튼 */}
      <button
        onClick={handleClick}
        disabled={!email || !isValidEmail(email) || isLoading}
        className="w-full py-3 px-4 bg-[#000000] text-[#FFFFFF] disabled:bg-[#ECECEC] disabled:text-[#7F7F7F]
                   font-medium rounded-lg
                   transition-colors cursor-pointer disabled:cursor-default"
      >
        {isLoading ? '확인 중...' : '계속'}
      </button>
    </div>
  );
}  