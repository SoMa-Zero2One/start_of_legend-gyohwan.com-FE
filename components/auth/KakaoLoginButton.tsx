"use client";

import { initiateKakaoLogin } from "@/lib/oauth/kakao";
import KakaoIcon from "@/components/icons/KakaoIcon";

export default function KakaoLoginButton() {
  return (
    <button
      onClick={initiateKakaoLogin}
      className="relative flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[4px] bg-[#FFE83B] text-gray-900 hover:bg-[#FDD835]"
    >
      <KakaoIcon className="absolute left-4" size={20} />
      카카오로 시작하기
    </button>
  );
}
