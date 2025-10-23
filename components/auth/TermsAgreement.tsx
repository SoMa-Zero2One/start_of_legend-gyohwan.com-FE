import Link from "next/link";

export default function TermsAgreement() {
  return (
    <div className="medium-body-3 flex items-center justify-center gap-[20px] text-center">
      <Link href="/terms" className="underline">
        이용약관
      </Link>
      <Link href="/privacy" className="underline">
        개인정보처리방침
      </Link>
    </div>
  );
}
