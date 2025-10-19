'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import { useAuthStore } from "@/stores/authStore";
import StrategyRoomEntrances from "@/components/home/StrategyRoomEntrances";

export default function Home() {
  const { isLoading, isLoggedIn, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-[32px] h-[32px] bg-[#ECECEC] rounded-full animate-pulse"></div>
          </div>
        ) : isLoggedIn ? (
          <div className="flex items-center gap-2">
            <div className="w-[32px] h-[32px] bg-[#ECECEC] rounded-full flex items-center justify-center">
              <Image
                src="/icons/ico_profile.svg"
                alt="Profile"
                width={20}
                height={20}
              />
            </div>
          </div>
        ) : (
          <Link
            href="/log-in-or-create-account"
            className="text-[#000000] font-regular text-[12px] flex items-center gap-[4px]">
            <Image
              src="/icons/ico_login.svg"
              alt="Login"
              width={20}
              height={20}
            />
            로그인
          </Link>
        )}
      </Header>
      <HeroSection />
      <FeatureSection />
      <StrategyRoomEntrances />
    </div>
  );
}
