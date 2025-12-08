"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import KakaoIcon from "@/components/icons/KakaoIcon";
import ProfileIconWithFallback from "@/components/icons/ProfileIconWithFallback";
import ProfileField from "@/components/my-page/ProfileField";
import { useAuthStore } from "@/stores/authStore";
import { saveRedirectUrl } from "@/lib/utils/redirect";

export default function MyInfoPage() {
  const { user, isLoading: authLoading, logout } = useAuthStore();
  const router = useRouter();

  // 로그인 체크 - Hard-gate
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      saveRedirectUrl("/my-page");
      router.replace("/log-in-or-create-account");
    }
  }, [authLoading, user, router]);

  // 로딩 중이거나 리다이렉트 진행 중
  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="내 정보 관리" showPrevButton showHomeButton showBorder />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  const isBasicLogin = user.loginType === "BASIC";
  const isSocialLogin = user.loginType === "SOCIAL";

  // 학교 인증 버튼 클릭 핸들러
  const handleSchoolVerification = () => {
    // 리다이렉트 URL 저장 후 학교 인증 페이지로 이동
    saveRedirectUrl("/my-page");
    router.push("/school-verification");
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const navigationItems = [
    {
      key: "info",
      label: "내 정보",
      onClick: undefined,
      isVisible: true,
      isActive: true,
    },
    {
      key: "password",
      label: "비밀번호 변경",
      onClick: () => router.push("/change-password"),
      isVisible: isBasicLogin,
    },
    {
      key: "logout",
      label: "로그아웃",
      onClick: handleLogout,
      isVisible: true,
    },
    {
      key: "delete",
      label: "회원 탈퇴",
      onClick: () => router.push("/delete-account"),
      isVisible: true,
    },
  ] as const;

  const mobileActions = navigationItems.filter((item) => item.key !== "info" && item.isVisible);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header title="내 정보 관리" showPrevButton showHomeButton showBorder />

      <main className="flex flex-1 flex-col pt-[30px] pb-[40px] lg:px-[20px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-[24px] px-[20px] lg:flex-row lg:items-start lg:gap-[32px]">
          {/* Desktop-only navigation */}
          <aside className="hidden w-full rounded-[20px] border border-gray-200 bg-white px-[24px] py-[32px] shadow-sm lg:flex lg:w-[260px] lg:flex-col">
            <p className="subhead-1 mb-[24px] text-gray-900">프로필</p>
            <div className="flex flex-col gap-[12px]">
              {navigationItems
                .filter((item) => item.isVisible)
                .map((item) => {
                  const isActive = item.key === "info";
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={item.onClick}
                      aria-current={isActive ? "page" : undefined}
                      className={`subhead-3 cursor-pointer rounded-[12px] px-4 py-[12px] text-left transition-colors ${
                        isActive ? "bg-primary-blue text-white" : "text-gray-800 hover:bg-gray-50 active:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
            </div>
          </aside>

          {/* Content */}
          <section className="flex-1 rounded-[20px] border border-gray-200 bg-white px-[20px] py-[24px] shadow-sm">
            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[8px]">
                <p className="subhead-1 text-gray-900">내 정보</p>
                <p className="medium-body-3 text-gray-600">프로필과 인증 상태를 확인하세요.</p>
              </div>

              <div className="flex flex-col gap-[24px] lg:flex-row lg:gap-[48px]">
                {/* 프로필 이미지 */}
                <div className="flex flex-col items-center gap-[12px] lg:w-[260px] lg:items-center">
                  <div className="relative">
                    <ProfileIconWithFallback profileUrl={user.profileUrl} size={130} />
                    {/* <button
                      onClick={handleComingSoon}
                      className="absolute right-2 bottom-2 flex h-[40px] w-[40px] items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
                    >
                      <PencilIcon size={20} strokeWidth={1.2} />
                    </button> */}
                  </div>
                </div>

                {/* Profile fields */}
                <div className="flex flex-1 flex-col gap-[16px]">
                  <ProfileField label="닉네임" value={user.nickname} buttonText="" />

                  {/* 이메일 (BASIC 로그인만 표시) */}
                  {isBasicLogin && user.email && <ProfileField label="이메일" value={user.email} showCheckIcon />}

                  {/* 간편 로그인 */}
                  {isSocialLogin && user.socialType && (
                    <div className="flex flex-col gap-[8px]">
                      <label className="medium-body-3 text-gray-900">간편 로그인</label>
                      <div className="flex items-center gap-[12px]">
                        {user.socialType === "GOOGLE" && (
                          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[6px] border border-gray-300">
                            <GoogleIcon size={24} />
                          </div>
                        )}
                        {user.socialType === "KAKAO" && (
                          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[6px] bg-[#FFE83B]">
                            <KakaoIcon size={24} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 학교 인증 */}
                  <ProfileField
                    label="학교 인증"
                    value={user.schoolEmail || "학교 인증을 진행하지 않았습니다."}
                    buttonText={!user.schoolVerified ? "인증하기" : undefined}
                    onButtonClick={!user.schoolVerified ? handleSchoolVerification : undefined}
                    showCheckIcon={user.schoolVerified}
                  />
                </div>
              </div>

              {/* Mobile actions */}
              {mobileActions.length > 0 && (
                <div className="flex flex-col divide-y divide-gray-200 rounded-[12px] border border-gray-200 lg:hidden">
                  {mobileActions.map((item) => (
                    <button
                      key={item.key}
                      onClick={item.onClick}
                      className="medium-body-3 flex items-center justify-between px-4 py-4 text-left text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100"
                    >
                      {item.label}
                      <ChevronRightIcon size={18} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
