import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header>
        <Link
          href="/log-in-or-create-account"
          className="text-[#000000] font-regular text-[12px] flex items-center gap-[4px]">
          <Image
            src="/icons/ico_login.svg"
            alt="Login"
            width={20}
            height={20}
          />
          로그인
        </Link>
      </Header>
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
      <div className="relative py-[60px] flex flex-col px-[20px] gap-[40px] overflow-hidden">
        <div
          className="absolute w-[80px] h-[80px] top-[220px] left-[350px] rounded-full 
                    opacity-10 bg-gradient-to-br from-[#00D0FF] via-[#029EFA] to-[#056DFF]"
        ></div>
        <div
          className="absolute w-[80px] h-[80px] top-[530px] -left-[40px] rounded-full 
                    opacity-10 bg-gradient-to-br from-[#00D0FF] via-[#029EFA] to-[#056DFF]"
        ></div>
        <div className="flex flex-col gap-[20px] z-10">
          <p className="text-[30px] font-bold">
            지원 대학과 <span className="text-[#056DFF]">성적을 공유하며</span><br /> 한께 전략을 세워보세요
          </p>
          <p className="text-[#2E2E2E]">
            어학 점수와 학점을 입력하면<br />
            다른 지원자들의 정보를 한눈에 볼 수 있어요.
          </p>
        </div>
        <div className="relative border-1 border-[#056DFF] text-[#056DFF] rounded-[10px] p-[16px] w-fit">
          <span className="absolute -top-3 left-[12px] bg-white font-bold text-[14px] px-[8px] text-sm">
            Point!
          </span>
          개인 정보는 공개되지 않으며,<br />
          <span>공유용 닉네임이 자동으로 생성돼요!</span>
        </div>
        <Image
          src="/images/mainPage-2.png"
          alt="교환닷컴"
          width={350}
          height={192}
          className="rounded-[10px]"
          priority
        />
      </div>
    </div>
  );
}
