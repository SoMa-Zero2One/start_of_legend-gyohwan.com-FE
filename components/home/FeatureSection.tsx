import Image from "next/image";
import InfoBox from "./InfoBox";

export default function FeatureSection() {
  return (
    <div className="relative py-[60px] flex flex-col px-[20px] gap-[40px] overflow-hidden">
      {/* 그라데이션 배경 */}
      <div
        className="absolute w-[80px] h-[80px] top-[220px] left-[350px] rounded-full
                  opacity-10 bg-gradient-to-br from-[#00D0FF] via-[#029EFA] to-[#056DFF]"
      ></div>
      <div
        className="absolute w-[80px] h-[80px] top-[530px] -left-[40px] rounded-full
                  opacity-10 bg-gradient-to-br from-[#00D0FF] via-[#029EFA] to-[#056DFF]"
      ></div>

      {/* 텍스트 */}
      <div className="flex flex-col gap-[20px] z-10">
        <p className="text-[30px] font-bold">
          지원 대학과 <span className="text-[#056DFF]">성적을 공유하며</span><br /> 함께 전략을 세워보세요
        </p>
        <p className="text-[#2E2E2E]">
          어학 점수와 학점을 입력하면<br />
          다른 지원자들의 정보를 한눈에 볼 수 있어요.
        </p>
      </div>

      {/* Point 박스 */}
      <InfoBox />

      {/* 이미지 */}
      <Image
        src="/images/mainPage-2.png"
        alt="교환닷컴"
        width={350}
        height={192}
        className="rounded-[10px]"
        priority
      />
    </div>
  );
}
