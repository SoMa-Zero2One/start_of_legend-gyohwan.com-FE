"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import StrategyRoomEntrances from "@/components/home/StrategyRoomEntrances";
import HeaderAuthSection from "@/components/layout/HeaderAuthSection";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import NavigationTab from "@/components/home/NavigationTab";
import { useAuthStore } from "@/stores/authStore";
import { Season } from "@/types/season";

interface HomePageProps {
  initialSeasons: Season[];
}

export default function HomePage({ initialSeasons }: HomePageProps) {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const [floatingButton, setFloatingButton] = useState<{
    label: string;
    action: () => void;
  } | null>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  // Set floating button based on user and seasons
  useEffect(() => {
    if (initialSeasons.length === 0) {
      setFloatingButton(null);
      return;
    }

    // 1. 로그인되어 있지 않은 유저
    if (!user || !isLoggedIn) {
      setFloatingButton({
        label: "교환학생 모집 중인 대학 보기",
        action: () => {
          document.getElementById("strategy-room-entrances")?.scrollIntoView({
            behavior: "smooth",
          });
        },
      });
      return;
    }

    // 2. 지원한 시즌이 있는지 확인
    const appliedSeason = initialSeasons.find((s) => s.hasApplied);
    if (appliedSeason) {
      setFloatingButton({
        label: "우리 학교 실시간 경쟁률 바로가기",
        action: () => router.push(`/strategy-room/${appliedSeason.seasonId}`),
      });
      return;
    }

    // 3. 본인 학교 시즌이 있는지 확인
    const mySchoolSeason = initialSeasons.find((s) => s.domesticUniversity === user.domesticUniversity);
    if (mySchoolSeason && user.domesticUniversity) {
      setFloatingButton({
        label: "우리 학교 실시간 경쟁률 바로가기",
        action: () => router.push(`/strategy-room/${mySchoolSeason.seasonId}`),
      });
      return;
    }

    // 4. 그 외: 탐색 유도
    setFloatingButton({
      label: "교환학생 모집 중인 대학 보기",
      action: () => {
        document.getElementById("strategy-room-entrances")?.scrollIntoView({
          behavior: "smooth",
        });
      },
    });
  }, [user, isLoggedIn, initialSeasons, router]);

  // Handle scroll to fade out button when approaching StrategyRoomEntrances
  useEffect(() => {
    const handleScroll = () => {
      const entrancesSection = document.getElementById("strategy-room-entrances");
      if (!entrancesSection) return;

      const rect = entrancesSection.getBoundingClientRect();
      const threshold = window.innerHeight * 0.3; // 화면의 30% 지점

      // StrategyRoomEntrances가 뷰포트 상단 30% 이내로 들어오면 fade-out
      setIsButtonVisible(rect.top > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 상태 확인

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header showLogo showBorder>
        <HeaderAuthSection />
      </Header>
      <NavigationTab />
      <HeroSection />
      <FeatureSection />
      <StrategyRoomEntrances initialSeasons={initialSeasons} />
      <Footer />

      {floatingButton && (
        <FloatingActionButton
          label={floatingButton.label}
          onClick={floatingButton.action}
          isVisible={isButtonVisible}
        />
      )}
    </div>
  );
}
