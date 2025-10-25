import Image from "next/image";

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
          <a href="/terms" className="caption-1 font-bold text-white hover:underline">
            서비스 이용약관
          </a>
          <a href="/privacy" className="caption-1 font-bold text-white hover:underline">
            개인정보처리방침
          </a>
        </div>

        {/* 저작권 정보 */}
        <div className="caption-2 py-[20px] text-gray-700">
          <p>Copyright &copy; {new Date().getFullYear()} 교환닷컴. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
