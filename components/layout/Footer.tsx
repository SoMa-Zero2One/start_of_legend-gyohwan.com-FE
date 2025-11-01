import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black px-[20px] py-[40px]">
      <div className="mx-auto max-w-[1200px]">
        {/* 로고 */}
        <div className="mb-[24px]">
          <Image src="/logos/logo-dark-full.svg" alt="전설의 시작" width={120} height={32} priority />
        </div>

        {/* 문의 */}
        <div className="caption-1 mb-[24px] flex items-center gap-[8px] text-gray-400">
          <span className="font-semibold text-white">문의 :</span>
          <span className="transition-colors hover:text-white">zero2one.soma@gmail.com</span>
        </div>

        {/* 링크 섹션 */}
        <div className="flex items-center gap-[24px] border-b-[1px] border-gray-700 pb-[12px]">
          <Link href="/terms" className="caption-1 font-bold text-white hover:underline">
            서비스 이용약관
          </Link>
          <Link href="/privacy" className="caption-1 font-bold text-white hover:underline">
            개인정보처리방침
          </Link>
        </div>

        {/* 회사 정보 및 저작권 */}
        <div className="caption-2 py-[20px] text-gray-700">
          <p className="mb-[8px]">
            바삭크리스피 | 주소: 인천광역시 미추홀구 인하로 100, 인하드림센터동 2층 213A호 인하드림센터 1 관 213A 호 |
            사업자등록번호: 671-38-01352
          </p>
          <p>Copyright &copy; {new Date().getFullYear()} 교환닷컴. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
