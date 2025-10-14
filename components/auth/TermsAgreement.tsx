import Link from "next/link";

export default function TermsAgreement() {
  return (
    <div className="flex items-center justify-center gap-[20px] text-xs text-center text-gray-500">
      <Link href="/terms" className="underline hover:text-gray-700 transition-colors">
        이용약관
      </Link>
      <Link href="/privacy" className="underline hover:text-gray-700 transition-colors">
        개인정보처리방침
      </Link>
    </div>
  );
}