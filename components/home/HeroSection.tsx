import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="relative aspect-[390/360] w-full">
      <Image src="/images/mainPage-1.png" alt="교환닷컴" fill className="object-cover" priority />
      <div className="absolute inset-0 flex flex-col justify-center gap-[10px] text-center text-white">
        <h1 className="g-head-3">
          준비부터 파견까지,
          <br />
          교환학생이 쉬워지는 동행
        </h1>
        <p className="g-subhead-3">함께하는 길잡이 교환닷컴</p>
      </div>
    </div>
  );
}
