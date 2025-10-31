import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="px-[20px]">
      <div className="relative aspect-[390/360] w-full overflow-hidden rounded-[10px]">
        <Image src="/images/mainPage-1.png" alt="교환닷컴" fill priority />
        <div className="absolute inset-0 flex flex-col justify-center gap-[10px] text-center text-white">
          <p className="g-head-3">
            준비부터 파견까지,
            <br />
            교환학생이 쉬워지는 동행
          </p>
          <p className="g-subhead-3">함께하는 길잡이 교환닷컴</p>
        </div>
      </div>
    </div>
  );
}
