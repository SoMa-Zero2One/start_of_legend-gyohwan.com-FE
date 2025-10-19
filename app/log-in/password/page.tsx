'use client';

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import LoginForm from '@/components/auth/LoginForm';
import TermsAgreement from '@/components/auth/TermsAgreement';

function LoginPasswordContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="로그인" />
      <div className="flex-1 flex flex-col items-center justify-between pt-[60px] pb-[36px]">
        <div className="w-full flex flex-col items-center px-[10px]">
          <div className="w-[330px] flex flex-col justify-center gap-[60px]">
            {/* 헤더 */}
            <div className="text-center">
              <h1 className="text-[24px] font-bold">
                비밀번호를 입력하세요
              </h1>
            </div>

            {/* 로그인 폼 */}
            <LoginForm />
          </div>
        </div>

        {/* 약관 동의 */}
        <TermsAgreement />
      </div>
    </div>
  );
}

export default function LoginPassword() {
  return (
    <Suspense fallback={null}>
      <LoginPasswordContent />
    </Suspense>
  );
}
