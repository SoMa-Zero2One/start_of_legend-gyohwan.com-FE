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

  const handleLogin = useCallback(() => {
    if (redirectPath) {
      saveRedirectUrl(redirectPath);
    }
    router.push("/log-in-or-create-account");
  }, [redirectPath, router]);

  if (isLoading) {
    return <div className="h-[32px] w-[32px] animate-pulse rounded-full bg-[#ECECEC]" />;
  }

  if (isLoggedIn) {
    return <ProfileMenu />;
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="caption-2 flex items-center gap-[4px] text-gray-900"
    >
      <LoginIcon size={20} />
      로그인
    </button>
  );
}
