"use client";

import { initiateGoogleLogin } from "@/lib/oauth/google";
import GoogleIcon from "@/components/icons/GoogleIcon";

export default function GoogleLoginButton() {
  return (
    <button
      onClick={initiateGoogleLogin}
      className="relative flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[4px] border border-gray-300 bg-white text-gray-900 hover:bg-gray-300"
    >
      <GoogleIcon className="absolute left-4" size={20} />
      Google로 계속하기
    </button>
  );
}
