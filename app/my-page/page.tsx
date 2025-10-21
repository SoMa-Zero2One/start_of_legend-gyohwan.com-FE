"use client";

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import KakaoIcon from "@/components/icons/KakaoIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";
import ProfileField from "@/components/my-page/ProfileField";
import { useAuthStore } from "@/stores/authStore";

export default function MyInfoPage() {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 로그인되지 않은 경우
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="내 정보 관리" />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-700">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

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
          <ProfileField label="닉네임" value={user.nickname} buttonText="변경하기" onButtonClick={handleComingSoon} />
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
          <ProfileField
            label="이메일"
            value={user.email}
            buttonText="변경하기"
            onButtonClick={handleComingSoon}
            showCheckIcon
          />
        )}

        {/* 학교 인증 */}
        <ProfileField
          label="학교 인증"
          value={user.schoolEmail || "학교 인증을 진행하지 않았습니다."}
          buttonText={user.schoolEmail ? "변경하기" : "등록하기"}
          onButtonClick={handleComingSoon}
          showCheckIcon={user.schoolVerified}
        />

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
