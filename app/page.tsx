"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import StrategyRoomEntrances from "@/components/home/StrategyRoomEntrances";
import HeaderAuthSection from "@/components/layout/HeaderAuthSection";

export default function Home() {
  // authStore가 자동으로 fetchUser()를 호출하므로 여기서는 불필요
  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        <HeaderAuthSection />
      </Header>
      <HeroSection />
      <FeatureSection />
      <StrategyRoomEntrances />
      <Footer />
    </div>
  );
}
