'use client';

import { initiateKakaoLogin } from '@/lib/oauth/kakao';

export default function KakaoLoginButton() {
  return (
    <button
      onClick={initiateKakaoLogin}
      className="w-full flex items-center justify-center gap-3 py-3 px-4
                 bg-[#FEE500] hover:bg-[#FDD835]
                 text-gray-900 font-medium rounded-lg
                 transition-colors"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7-.2.8-.7 2.8-.8 3.2-.1.5.2.5.4.4.3-.1 3.1-2.1 3.6-2.5.7.1 1.4.2 2.1.2 5.5 0 10-3.6 10-8S17.5 3 12 3z" />
      </svg>
      카카오로 계속하기
    </button>
  );
}
