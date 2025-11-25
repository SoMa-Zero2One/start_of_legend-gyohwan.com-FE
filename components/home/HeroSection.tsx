"use client";

import Image from "next/image";
import DownIcon from "@/components/icons/DownIcon";
import { useIsDesktop } from "@/lib/hooks/useMediaQuery";

export default function HeroSection() {
  const isDesktop = useIsDesktop();

  return (
    <div className="px-[20px] lg:py-[30px]">
      <div className="relative aspect-[390/360] w-full overflow-hidden rounded-[10px] lg:aspect-[1280/600]">
        {/* 조건부 렌더링: 브레이크포인트에 따라 하나의 이미지만 로드 */}
        <Image
          src={isDesktop ? "/images/mainPage-1_desktop.png" : "/images/mainPage-1.png"}
          alt="교환닷컴"
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 1280px, 390px"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[10px] text-center text-white">
          <h1 className="g-head-3 lg:!text-[60px]">
            준비부터 파견까지,
            <br />
            교환학생이 쉬워지는 동행
          </h1>
          <p className="g-subhead-3 lg:!text-[24px]">함께하는 길잡이 교환닷컴</p>
        </div>

        {/* 스크롤 다운 아이콘 (위아래 애니메이션) */}
        <div className="absolute bottom-[20px] left-1/2 hidden -translate-x-1/2 animate-bounce text-white opacity-80 lg:inline">
          <DownIcon size={32} />
        </div>
      </div>
    </div>
  );
}
