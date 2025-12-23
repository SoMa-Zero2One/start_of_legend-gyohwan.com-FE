"use client";

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import CommunityBannerSection from "@/components/home/CommunityBannerSection";
import StrategyRoomEntrances from "@/components/home/StrategyRoomEntrances";
import HeaderAuthSection from "@/components/layout/HeaderAuthSection";
import NavigationTab from "@/components/home/NavigationTab";
import { useSeasonsStore } from "@/stores/seasonsStore";
import { Season } from "@/types/season";

interface HomePageProps {
  initialSeasons: Season[];
  initialPastSeasons: Season[];
}

export default function HomePage({ initialSeasons, initialPastSeasons }: HomePageProps) {
  const setActiveSeasons = useSeasonsStore((state) => state.setActiveSeasons);

  useEffect(() => {
    if (initialSeasons.length > 0) {
      setActiveSeasons(initialSeasons);
    }
  }, [initialSeasons, setActiveSeasons]);

  useEffect(() => {
    if (window.location.hash === "#strategy-room-entrances") {
      document.getElementById("strategy-room-entrances")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header showLogo showBorder>
        <HeaderAuthSection />
      </Header>
      <NavigationTab />
      <HeroSection />
      <FeatureSection />
      <CommunityBannerSection />
      <StrategyRoomEntrances initialSeasons={initialSeasons} initialPastSeasons={initialPastSeasons} />
      <Footer />
    </div>
  );
}
