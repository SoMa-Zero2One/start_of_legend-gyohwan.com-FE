"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import ProfileMenu from "@/components/layout/ProfileMenu";

export default function HeaderAuthSection() {
  const { isLoading, isLoggedIn } = useAuthStore();

  if (isLoading) {
    return <div className="h-[32px] w-[32px] animate-pulse rounded-full bg-[#ECECEC]" />;
  }

  if (isLoggedIn) {
    return <ProfileMenu />;
  }

  return (
    <Link href="/log-in-or-create-account" className="caption-2 flex items-center gap-[4px]">
      <Image src="/icons/ico_login.svg" alt="Login" width={20} height={20} />
      로그인
    </Link>
  );
}
