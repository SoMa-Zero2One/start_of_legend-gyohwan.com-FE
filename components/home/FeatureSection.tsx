import Image from "next/image";
import InfoBox from "./InfoBox";

export default function FeatureSection() {
  return (
    <div className="relative flex flex-col gap-[40px] overflow-hidden px-[20px] py-[60px] md:flex-row md:justify-between xl:py-[100px] xl:pr-[20px] xl:pl-[80px]">
      {/* 그라데이션 배경 */}
      <div className="absolute top-[220px] -right-[40px] h-[80px] w-[80px] rounded-full bg-gradient-to-br from-[#00D0FF] via-[#029EFA] to-[#056DFF] opacity-10 xl:hidden"></div>
      <div className="absolute top-[530px] -left-[40px] h-[80px] w-[80px] rounded-full bg-gradient-to-br from-[#00D0FF] via-[#029EFA] to-[#056DFF] opacity-10 xl:hidden"></div>

      {/* 텍스트 */}
      <div className="flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[20px]">
          <h2 className="head-3 xl:!text-[42px]">
            지원 대학과 <span className="text-primary-blue">성적을 공유하며</span>
            <br /> 함께 전략을 세워보세요
          </h2>
          <p className="body-2 text-gray-900 xl:!text-[20px]">
            어학 점수와 학점을 입력하면
            <br />
            다른 지원자들의 정보를 한눈에 볼 수 있어요.
          </p>
        </div>
        {/* Point 박스 */}
        <InfoBox />
      </div>

      {/* 이미지 */}
      <div className="relative h-[192px] w-[350px] overflow-hidden rounded-[10px] md:h-[400px] md:w-[350px] xl:h-[400px] xl:w-[540px]">
        <Image
          src="/images/mainPage-2.png"
          alt="교환닷컴"
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1280x) 540px, (min-width: 768px) 400px, 350px"
        />
      </div>
    </div>
  );
}
