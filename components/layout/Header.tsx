import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
}

export default function Header({ children, title }: HeaderProps) {
  return (
    <header className="flex h-[50px] items-center justify-between border-b-[1px] border-b-gray-500 px-[20px]">
      {title ? (
        /* 제목만 표시 (중앙 정렬) */
        <div className="flex flex-1 items-center justify-center">
          <h1 className="body-2">{title}</h1>
        </div>
      ) : (
        <>
          {/* 로고 */}
          <Link href="/">
            <Image src="/logos/logo-blue-full.svg" alt="Logo" width={96} height={20} priority />
          </Link>

          {/* children */}
          {children}
        </>
      )}
    </header>
  );
}
