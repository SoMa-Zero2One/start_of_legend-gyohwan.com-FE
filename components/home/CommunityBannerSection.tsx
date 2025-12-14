"use client";

import Image from "next/image";
import Link from "next/link";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import { useIsDesktop } from "@/lib/hooks/useMediaQuery";

export default function CommunityBannerSection() {
  const isDesktop = useIsDesktop();

  // 데스크톱에서만 렌더링
  if (!isDesktop) return null;

  return (
    <div className="px-[20px] pt-[60px] pb-[160px]">
      <Link href="/community" className="group block">
        <div className="relative h-[300px] w-full overflow-hidden rounded-[10px]">
          <Image
            src="/images/mainPage-3.png"
            alt="교환닷컴 커뮤니티"
            fill
            className="object-cover"
            sizes="1280px"
          />
          {/* 텍스트 오버레이 */}
          <div className="absolute inset-0 flex flex-col items-start justify-center gap-[12px] px-[60px] text-white">
            <h2 className="text-[40px] font-bold leading-[1.3]">
              교환 준비,
              <br />
              혼자보다 함께가 더 쉬워요
            </h2>
            <p className="text-[20px] leading-[1.6]">
              나라별, 대학별 커뮤니티에서 선배들의 꿀팁과 경험을 나눠보세요.
            </p>
            {/* 버튼 */}
            <div className="mt-[12px] flex items-center gap-[8px] rounded-[8px] bg-white/20 px-[20px] py-[12px] backdrop-blur-sm transition-all duration-200 group-hover:bg-white/30">
              <span className="text-[18px] font-semibold">교환닷컴 커뮤니티</span>
              <ChevronRightIcon
                size={20}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
