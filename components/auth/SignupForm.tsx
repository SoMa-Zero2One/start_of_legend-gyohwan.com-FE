'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signupWithEmail, confirmEmailSignup } from '@/lib/api/auth';
import PasswordStep from './signUpSteps/PasswordStep';
import TermsStep from './signUpSteps/TermsStep';
import VerificationStep from './signUpSteps/VerificationStep';

type Step = 'password' | 'terms' | 'verification';

interface SignupFormProps {
  onStepChange?: (step: Step) => void;
  onEmailChange?: (email: string) => void;
}

export default function SignupForm({ onStepChange, onEmailChange }: SignupFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step 관리
  const [step, setStep] = useState<Step>('password');

  // 이메일 및 비밀번호 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 약관 동의 상태
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // UI 상태
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 가져오기 (URL 파라미터 우선, 없으면 SessionStorage)
  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    const emailFromStorage = sessionStorage.getItem('pendingEmail');
    const finalEmail = emailFromUrl || emailFromStorage || '';

    if (!finalEmail) {
      // 이메일이 없으면 처음 페이지로 리다이렉트
      router.push('/log-in-or-create-account');
      return;
    }

    setEmail(finalEmail);
    onEmailChange?.(finalEmail);
  }, [searchParams, router, onEmailChange]);

  // Step 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  // 비밀번호 유효성 검증
  const isValidPassword = (password: string): boolean => {
    return password.length >= 12;
  };

  // 비밀번호 확인 일치 여부
  const isPasswordMatch = (): boolean => {
    return password === passwordConfirm && passwordConfirm.length > 0;
  };

  // 이메일 편집
  const handleEdit = () => {
    sessionStorage.removeItem('pendingEmail');
    router.push('/log-in-or-create-account');
  };

  // 비밀번호 입력 완료 후 약관 동의 화면으로 이동
  const handlePasswordSubmit = () => {
    setError('');

    // 비밀번호 검증
    if (!isValidPassword(password)) {
      setError('비밀번호는 12글자 이상으로 설정해주세요!');
      return;
    }

    if (!isPasswordMatch()) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 약관 동의 화면으로 이동
    setStep('terms');
  };

  // 약관 동의 후 회원가입 API 호출
  const handleTermsSubmit = async () => {
    setError('');

    if (!agreeTerms || !agreePrivacy) {
      setError('모든 약관에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 백엔드 회원가입 API 호출 (이메일 인증 발송)
      await signupWithEmail(email, password);

      // 성공 시 이메일 인증 화면으로 전환
      setStep('verification');
    } catch (err) {
      console.error('Signup error:', err);
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 재전송 핸들러
  const handleResendEmail = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signupWithEmail(email, password);
    } catch (err) {
      console.error('Resend error:', err);
      setError('이메일 재전송 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 인증코드 검증 핸들러
  const handleVerifyCode = async (code: string) => {
    setError('');
    setIsLoading(true);

    try {
      // 인증코드 검증 API 호출
      await confirmEmailSignup(email, code);

      // 성공 시 세션 정리 및 회원가입 완료 페이지로 이동
      sessionStorage.removeItem('pendingEmail');
      router.push('/create-account-complete');
    } catch (err) {
      console.error('Verification error:', err);
      setError('인증코드가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step에 따라 적절한 컴포넌트 렌더링
  if (step === 'password') {
    return (
      <PasswordStep
        email={email}
        password={password}
        passwordConfirm={passwordConfirm}
        onPasswordChange={setPassword}
        onPasswordConfirmChange={setPasswordConfirm}
        onEdit={handleEdit}
        onSubmit={handlePasswordSubmit}
        error={error}
        isLoading={isLoading}
      />
    );
  }

  if (step === 'terms') {
    return (
      <TermsStep
        agreeTerms={agreeTerms}
        agreePrivacy={agreePrivacy}
        onAgreeTermsChange={setAgreeTerms}
        onAgreePrivacyChange={setAgreePrivacy}
        onSubmit={handleTermsSubmit}
        error={error}
        isLoading={isLoading}
      />
    );
  }

  return (
    <VerificationStep
      onVerify={handleVerifyCode}
      onResend={handleResendEmail}
      error={error}
      isLoading={isLoading}
    />
  );
}
