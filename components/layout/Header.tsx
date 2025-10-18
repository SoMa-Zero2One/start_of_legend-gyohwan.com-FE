import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
}

export default function Header({ children, title }: HeaderProps) {
  return (
    <header className="flex items-center justify-between bg-white px-[20px] h-[50px] border-b-[1px] border-b-[#ECECEC]">
      {title ? (
        /* 제목만 표시 (중앙 정렬) */
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-[16px] font-medium">{title}</h1>
        </div>
      ) : (
        <>
          {/* 로고 */}
          <Link href="/">
            <Image
              src="/logos/logo-blue-full.svg"
              alt="Logo"
              width={96}
              height={20}
              priority
            />
          </Link>

          {/* children */}
          {children}
        </>
      )}
    </header>
  );
}
