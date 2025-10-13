import KakaoLoginButton from '@/components/auth/KakaoLoginButton';
import EmailLoginForm from '@/components/auth/EmailLoginForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

export default function LoginOrCreateAccount() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full space-y-6 flex flex-col justify-center items-center">
        <div className="w-[320px] flex flex-col justify-center gap-[60px]">
          {/* 헤더 */}
          <div className="text-center">
            <h1 className="text-[36px] font-bold">
              교환닷컴에 오신 걸<br /> 환영합니다
            </h1>
          </div>

          <div className='flex flex-col gap-[20px]'>
            <div className="flex flex-col gap-[8px] pb-[20px]">
            {/* 구글 로그인 */}
            <GoogleLoginButton />

            {/* 카카오 로그인 */}
            <KakaoLoginButton />
            </div>


            {/* 구분선 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">또는</span>
              </div>
            </div>

            {/* 이메일 로그인 */}
            <EmailLoginForm />
          </div>

          {/* 약관 동의 */}
          <div className="flex items-center justify-center gap-[20px] text-xs text-center text-gray-500">
            <a href="#" className="underline block">이용약관</a>
            <a href="#" className="underline block">개인정보처리방침</a>
          </div>
          </div>
      </div>
    </div>
  );
}
