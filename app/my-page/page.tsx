"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import type { User } from "@/types/user";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import KakaoIcon from "@/components/icons/KakaoIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";

// Mock 데이터
const MOCK_USERS: { [key: string]: User } = {
  email: {
    userId: 96,
    email: "yoonc01@cau.ac.kr",
    schoolEmail: null,
    nickname: "부드러운 배629",
    domesticUniversity: null,
    schoolVerified: false,
    loginType: "BASIC",
    socialType: null,
  },
  google: {
    userId: 89,
    email: null,
    schoolEmail: null,
    nickname: "f60e1816-2207-47f2-8e65-c90f854908fb",
    domesticUniversity: null,
    schoolVerified: false,
    loginType: "SOCIAL",
    socialType: "GOOGLE",
  },
  kakao: {
    userId: 88,
    email: null,
    schoolEmail: null,
    nickname: "6254b019-7e18-4a4b-a6eb-c0d5a1053dc4",
    domesticUniversity: null,
    schoolVerified: false,
    loginType: "SOCIAL",
    socialType: "KAKAO",
  },
};

export default function MyInfoPage() {
  // Mock 데이터 선택 (email, google, kakao 중 하나)
  const [mockType] = useState<"email" | "google" | "kakao">("email");
  const user = MOCK_USERS[mockType];

  const isBasicLogin = user.loginType === "BASIC";
  const isSocialLogin = user.loginType === "SOCIAL";

  // 준비중 알림
  const handleComingSoon = () => {
    alert("준비중입니다.\n현재는 학교 인증만 가능합니다.");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="내 정보 관리" />

      <div className="flex w-full flex-col gap-[24px] px-[20px] pt-[30px]">
        <p className="subhead-1">내 정보</p>
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center gap-[8px]">
          <div className="relative">
            <ProfileIcon profileUrl={user.profileUrl} size={120} />
            <button
              onClick={handleComingSoon}
              className="absolute right-0 bottom-0 flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-white shadow transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <PencilIcon size={20} strokeWidth={1.2} />
            </button>
          </div>
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between">
            <label className="medium-body-3">닉네임</label>
            <button onClick={handleComingSoon} className="text-primary-blue cursor-pointer hover:underline">
              변경하기
            </button>
          </div>
          <input
            type="text"
            value={user.nickname}
            disabled
            className="w-full rounded-[4px] bg-gray-100 px-4 py-3 text-gray-700"
          />
          <p className="text-gray-700">
            * 한글/영문 포함 최대 10자 이내로 가능합니다.
            <br />* 닉네임은 변경 후 30일이 지나야 바꿀 수 있어요.
            <br />
            (최근 변경 일시: ####-##-## ##:##:##)
          </p>
        </div>

        {/* 간편 로그인 */}
        {isSocialLogin && user.socialType && (
          <div className="flex flex-col gap-[8px]">
            <label className="medium-body-3">간편 로그인</label>
            <div className="flex items-center">
              {user.socialType === "GOOGLE" && (
                <div className="flex items-center justify-center rounded-[4px] border border-gray-300 p-3">
                  <GoogleIcon size={20} />
                </div>
              )}
              {user.socialType === "KAKAO" && (
                <div className="flex items-center justify-center rounded-[4px] bg-[#FFE83B] p-3">
                  <KakaoIcon size={20} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 이메일 (BASIC 로그인만 표시) */}
        {isBasicLogin && user.email && (
          <div className="flex flex-col gap-[6px]">
            <div className="medium-body-3 flex items-center justify-between">
              <label>이메일</label>
              <button onClick={handleComingSoon} className="text-primary-blue cursor-pointer hover:underline">
                변경하기
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={user.email}
                disabled
                className="w-full rounded-[4px] bg-gray-100 px-4 py-3 text-gray-700"
              />
              <CheckIcon size={20} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        )}

        {/* 학교 인증 */}
        <div className="flex flex-col gap-[6px]">
          <div className="medium-body-3 flex items-center justify-between">
            <label>학교 인증</label>
            {user.schoolVerified ? (
              <span className="text-primary-blue">인증 완료</span>
            ) : (
              <button onClick={handleComingSoon} className="text-primary-blue cursor-pointer hover:underline">
                {user.schoolEmail ? "변경하기" : "등록하기"}
              </button>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={user.schoolEmail || "학교 인증을 진행하지 않았습니다."}
              disabled
              className="w-full rounded-[4px] bg-gray-100 px-4 py-3 text-gray-700"
            />
            {user.schoolVerified && (
              <CheckIcon size={20} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500" />
            )}
          </div>
        </div>

        {/* 기타 메뉴 */}
        <div className="flex flex-col">
          {/* 비밀번호 변경 (BASIC 로그인만 표시) */}
          {isBasicLogin && (
            <button className="medium-body-3 flex cursor-pointer items-center justify-between border-t border-gray-300 py-4 transition-colors hover:bg-gray-100">
              비밀번호 변경
              <ChevronRightIcon size={18} />
            </button>
          )}
          <button className="medium-body-3 flex cursor-pointer items-center justify-between border-t border-gray-300 py-4 transition-colors hover:bg-gray-100">
            회원 탈퇴
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
