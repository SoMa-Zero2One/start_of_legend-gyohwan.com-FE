'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 형식 검증
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleClick = async () => {
    setError('');

    // 이메일 형식 검증
    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 백엔드에 이메일 확인 요청


      //// 회원가입 여부에 따라 페이지 이동
      //if (data.isRegistered) {
        //// 기존 회원 → 로그인 페이지
        //router.push(`/log-in/password?email=${encodeURIComponent(email)}`);
      //} else {
        //// 신규 회원 → 회원가입 페이지
        //router.push(`/create-account/password?email=${encodeURIComponent(email)}`);
      //}
    } catch (err) {
      //console.error('Email check error:', err);
      //setError('이메일 확인 중 오류가 발생했습니다.');
    } finally {
      //setIsLoading(false);
    }
  };

  return (
    <div className={`relative space-y-3 transition-all duration-300 ${isFocused ? 'mt-0' : 'mt-[36px]'}`}>
      {/* 이메일 입력 영역 */}
      <div className="relative">
        {/* 말풍선 */}
        <div
          className={`absolute w-full -top-full transition-opacity duration-300 ${
            isFocused ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="bg-black text-white text-[12px] py-2 px-4 rounded-md">
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
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="이메일 주소를 입력하세요"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all"
        />
      </div>

      {/* 계속 버튼 */}
      <button
        disabled={!email || !isValidEmail(email)}
        className="w-full py-3 px-4 bg-[#000000] text-[#FFFFFF] disabled:bg-[#ECECEC] disabled:text-[#7F7F7F]
                   font-medium rounded-lg
                   transition-colors cursor-pointer disabled:cursor-default"
      >
        계속
      </button>
    </div>
  );
}  