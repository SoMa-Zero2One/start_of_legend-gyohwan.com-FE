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
import { useAuthStore } from "@/stores/authStore";
import { getSeasons } from "@/lib/api/season";
import { Season } from "@/types/season";

export default function Home() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [floatingButton, setFloatingButton] = useState<{
    label: string;
    action: () => void;
  } | null>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  // Fetch seasons
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const data = await getSeasons();
        setSeasons(data.seasons);
      } catch (error) {
        console.error("Failed to fetch seasons:", error);
      }
    };

    fetchSeasons();
  }, []);

  // Set floating button based on user and seasons
  useEffect(() => {
    if (!isLoggedIn || !user || seasons.length === 0) {
      setFloatingButton(null);
      return;
    }

    // 1. 지원한 시즌이 있는지 확인
    const appliedSeason = seasons.find((s) => s.hasApplied);
    if (appliedSeason) {
      setFloatingButton({
        label: "우리 학교 실시간 경쟁률 바로가기",
        action: () => router.push(`/strategy-room/${appliedSeason.seasonId}`),
      });
      return;
    }

    // 2. 본인 학교 시즌이 있는지 확인
    const mySchoolSeason = seasons.find((s) => s.domesticUniversity === user.domesticUniversity);
    if (mySchoolSeason && user.domesticUniversity) {
      setFloatingButton({
        label: "우리 학교 실시간 경쟁률 바로가기",
        action: () => router.push(`/strategy-room/${mySchoolSeason.seasonId}`),
      });
      return;
    }

    // 3. 그 외: 탐색 유도
    setFloatingButton({
      label: "교환학생 모집 중인 대학 보기",
      action: () => {
        document.getElementById("strategy-room-entrances")?.scrollIntoView({
          behavior: "smooth",
        });
      },
    });
  }, [user, isLoggedIn, seasons, router]);

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
      <Header>
        <HeaderAuthSection />
      </Header>
      <HeroSection />
      <FeatureSection />
      <StrategyRoomEntrances />
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
