import Link from "next/link";
import Image from "next/image";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between bg-white px-[20px] h-[50px]">
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
      {children}
    </header>
  );
}
