import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="relative w-full aspect-[390/360]">
      <Image
        src="/images/mainPage-1.png"
        alt="교환닷컴"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[10px] text-white text-center font-bold">
        <p className="text-[30px]">
          준비부터 파견까지,<br />
          교환학생이 쉬워지는 동행
        </p>
        <p className="text-[16px]">
          함께하는 길잡이 교환닷컴
        </p>
      </div>
    </div>
  );
}
