"use client";

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import { useAuthStore } from "@/stores/authStore";
import StrategyRoomEntrances from "@/components/home/StrategyRoomEntrances";
import HeaderAuthSection from "@/components/layout/HeaderAuthSection";

export default function Home() {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        <HeaderAuthSection />
      </Header>
      <HeroSection />
      <FeatureSection />
      <StrategyRoomEntrances />
    </div>
  );
}
