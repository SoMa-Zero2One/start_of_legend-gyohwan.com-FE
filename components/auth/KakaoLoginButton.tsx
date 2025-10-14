'use client';

import { initiateKakaoLogin } from '@/lib/oauth/kakao';

export default function KakaoLoginButton() {
  return (
    <button
      onClick={initiateKakaoLogin}
      className="relative w-full h-[44px] flex items-center justify-center
                 bg-[#FFE83B] hover:bg-[#FDD835]
                 text-[#2E2E2E] font-medium rounded-[4px]
                 transition-colors cursor-pointer"
    >
      {/* 아이콘은 왼쪽에 고정 */}
      <svg
        className="absolute left-4 w-[20px] h-[20px]"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7-.2.8-.7 2.8-.8 3.2-.1.5.2.5.4.4.3-.1 3.1-2.1 3.6-2.5.7.1 1.4.2 2.1.2 5.5 0 10-3.6 10-8S17.5 3 12 3z" />
      </svg>

      카카오로 시작하기
    </button>
  );
}