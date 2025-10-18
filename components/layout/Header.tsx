'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
}

export default function Header({ children, title }: HeaderProps) {
  const { isLoading, isLoggedIn, fetchUser } = useAuthStore();

  useEffect(() => {
    // 로그인 페이지가 아닐 때만 사용자 정보 fetch
    if (!title) {
      fetchUser();
    }
  }, [title, fetchUser]);

  return (
    <header className="flex items-center justify-between bg-white px-[20px] h-[50px] border-b-[1px] border-b-[#ECECEC]">
      {title ? (
        /* 제목만 표시 (중앙 정렬) */
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-[16px] font-medium">{title}</h1>
        </div>
      ) : (
        <>
          {/* 로고 */}
          <Link href="/">
            <Image
              src="/logos/logo-blue-full.svg"
              alt="Logo"
              width={96}
              height={20}
              priority
            />
          </Link>

          {/* 프로필 아이콘 또는 children */}
          {isLoggedIn && !isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-[32px] h-[32px] bg-[#ECECEC] rounded-full flex items-center justify-center">
                <Image
                  src="/icon/ico_profile.svg"
                  alt="Profile"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          ) : (
            children
          )}
        </>
      )}
    </header>
  );
}
