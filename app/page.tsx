import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome
        </h1>
        <p className="text-gray-600">
          서비스를 이용하려면 로그인이 필요합니다.
        </p>

        <Link
          href="/log-in-or-create-account"
          className="block w-full py-3 px-4 bg-gray-900 hover:bg-gray-800
                   text-white font-medium rounded-lg
                   transition-colors"
        >
          로그인 또는 회원가입
        </Link>
      </div>
    </div>
  );
}
