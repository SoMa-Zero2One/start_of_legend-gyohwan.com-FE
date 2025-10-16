'use client';

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import PasswordSignupForm from '@/components/auth/PasswordSignupForm';
import TermsAgreement from '@/components/auth/TermsAgreement';

function PasswordSignupContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-between pt-[60px] pb-[36px]">
        <div className="w-full space-y-6 flex flex-col items-center px-[10px]">
          <div className="w-[330px] flex flex-col justify-center gap-[60px]">
            {/* 헤더 */}
            <div className="text-center">
              <h1 className="text-[24px] font-bold">
                계정 만들기
              </h1>
              <p className="text-[16px] text-[#2E2E2E] mt-[12px]">
                교환 닷컴 비밀번호를 설정하세요.
              </p>
            </div>

            {/* 비밀번호 입력 폼 */}
            <PasswordSignupForm />
          </div>
        </div>

        {/* 약관 동의 */}
        <TermsAgreement />
      </div>
    </div>
  );
}

export default function CreateAccountPassword() {
  return (
    <Suspense fallback={null}>
      <PasswordSignupContent />
    </Suspense>
  );
}
