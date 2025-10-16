'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PasswordInput from './PasswordInput';

export default function PasswordSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordConfirmTouched, setPasswordConfirmTouched] = useState(false);

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
  }, [searchParams, router]);

  // 비밀번호 유효성 검증
  const isValidPassword = (password: string): boolean => {
    return password.length >= 12;
  };

  // 비밀번호 확인 일치 여부
  const isPasswordMatch = (): boolean => {
    return password === passwordConfirm && passwordConfirm.length > 0;
  };

  const handleEdit = () => {
    // 이메일 편집 - 처음 페이지로 돌아가기
    sessionStorage.removeItem('pendingEmail');
    router.push('/log-in-or-create-account');
  };

  const handleSubmit = async () => {
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

    setIsLoading(true);

    try {
      // TODO: 백엔드 회원가입 API 호출
      console.log('회원가입:', { email, password });

      // 성공 시 로그인 페이지로 이동
      sessionStorage.removeItem('pendingEmail');
      router.push('/log-in-or-create-account');
    } catch (err) {
      console.error('Signup error:', err);
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      {/* 이메일 표시 */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <input
          type="email"
          value={email}
          disabled
          className="flex-1 bg-transparent text-gray-700 outline-none"
        />
        <button
          onClick={handleEdit}
          className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
        >
          편집
        </button>
      </div>

      {/* 비밀번호 입력 */}
      <PasswordInput
        value={password}
        onChange={setPassword}
        onBlur={() => setPasswordTouched(true)}
        placeholder="비밀번호"
        disabled={isLoading}
        showTooltip={true}
        tooltipMessage="비밀번호는 12글자 이상으로 설정해주세요!"
        showValidation={passwordTouched && password.length > 0}
        isValid={isValidPassword(password)}
        validationMessage={
          !isValidPassword(password)
            ? `비밀번호는 12글자 이상이어야 합니다. (현재: ${password.length}글자)`
            : '✓ 사용 가능한 비밀번호입니다.'
        }
      />

      {/* 비밀번호 확인 입력 */}
      <PasswordInput
        value={passwordConfirm}
        onChange={setPasswordConfirm}
        onBlur={() => setPasswordConfirmTouched(true)}
        placeholder="비밀번호 확인"
        disabled={isLoading}
        showValidation={passwordConfirmTouched && passwordConfirm.length > 0}
        isValid={password === passwordConfirm}
        validationMessage={
          password !== passwordConfirm
            ? '비밀번호가 일치하지 않습니다.'
            : '✓ 비밀번호가 일치합니다.'
        }
      />

      {/* 에러 메시지 */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* 계속 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!password || !passwordConfirm || isLoading}
        className="w-full py-3 px-4 bg-[#000000] text-[#FFFFFF] disabled:bg-[#ECECEC] disabled:text-[#7F7F7F]
                   font-medium rounded-lg
                   transition-colors cursor-pointer disabled:cursor-default"
      >
        {isLoading ? '처리 중...' : '계속'}
      </button>
    </div>
  );
}
