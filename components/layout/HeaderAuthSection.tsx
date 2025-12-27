"use client";

import { useMemo, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import ProfileMenu from "@/components/layout/ProfileMenu";
import LoginIcon from "@/components/icons/LoginIcon";
import { saveRedirectUrl } from "@/lib/utils/redirect";

export default function HeaderAuthSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoading, isLoggedIn } = useAuthStore();

  const redirectPath = useMemo(() => {
    if (!pathname) {
      return "/";
    }
    const search = searchParams.toString();
    return search ? `${pathname}?${search}` : pathname;
  }, [pathname, searchParams]);

  const navigateToAuthEntry = useCallback(() => {
    const shouldSaveRedirect = redirectPath && redirectPath !== "/";
    if (shouldSaveRedirect) {
      saveRedirectUrl(redirectPath);
    }
    router.push("/log-in-or-create-account");
  }, [redirectPath, router]);

  const handleLogin = useCallback(() => {
    navigateToAuthEntry();
  }, [navigateToAuthEntry]);

  const handleSignup = useCallback(() => {
    navigateToAuthEntry();
  }, [navigateToAuthEntry]);

  if (isLoading) {
    return <div className="h-[32px] w-[32px] animate-pulse rounded-full bg-[#ECECEC]" />;
  }

  if (isLoggedIn) {
    return <ProfileMenu />;
  }

  return (
    <div className="flex items-center gap-[8px] text-gray-900">
      <button
        type="button"
        onClick={handleLogin}
        className="body-2 hover:text-primary-blue flex cursor-pointer items-center gap-[6px] rounded-[6px] px-[4px] py-[2px] transition-colors duration-200"
      >
        <LoginIcon size={20} />
        <span>로그인</span>
      </button>
      <span className="hidden h-[16px] w-px bg-gray-200 xl:block" aria-hidden="true" />
      <button
        type="button"
        onClick={handleSignup}
        className="body-2 hover:text-primary-blue hidden cursor-pointer text-gray-900 transition-colors duration-200 xl:block"
      >
        <span>회원가입</span>
      </button>
    </div>
  );
}
