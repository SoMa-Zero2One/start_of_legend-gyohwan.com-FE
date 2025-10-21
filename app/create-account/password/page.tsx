"use client";

import { Suspense, useState } from "react";
import Header from "@/components/layout/Header";
import SignupForm from "@/components/auth/SignupForm";
import TermsAgreement from "@/components/auth/TermsAgreement";

type Step = "password" | "terms" | "verification";

function PasswordSignupContent() {
  const [currentStep, setCurrentStep] = useState<Step>("password");
  const [, setEmail] = useState("");

  const headerContent = {
    password: {
      title: "계정 만들기",
      subtitle: "교환 닷컴 비밀번호를 설정하세요.",
    },
    terms: {
      title: "약관 동의가 필요해요",
      subtitle: "교환닷컴 사용에 필요한 약관만 추렸어요.",
    },
    verification: {
      title: "받은 편지함을 확인하세요",
      subtitle: `받은 이메일에 인증 메일이 없다면\n스팸 메일함을 확인해주세요.`,
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="회원 가입" />
      <div className="flex flex-1 flex-col items-center justify-between pt-[60px] pb-[36px]">
        <div className="flex w-full flex-col items-center gap-[24px] px-[10px]">
          <div className="flex w-[330px] flex-col justify-center gap-[60px]">
            {/* 헤더 */}
            <div className="text-center">
              <h1 className="head-4">{headerContent[currentStep].title}</h1>
              <p className="body-2 mt-[12px] whitespace-pre-line text-gray-900">
                {headerContent[currentStep].subtitle}
              </p>
            </div>

            {/* 비밀번호 입력 폼 */}
            <SignupForm onStepChange={setCurrentStep} onEmailChange={setEmail} />
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
