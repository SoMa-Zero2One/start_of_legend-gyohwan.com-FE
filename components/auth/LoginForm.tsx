'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithEmail } from '@/lib/api/auth';
import PasswordInput from './PasswordInput';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  }, [searchParams, router]);

  // 이메일 편집
  const handleEdit = () => {
    sessionStorage.removeItem('pendingEmail');
    router.push('/log-in-or-create-account');
  };

  // 로그인 처리
  const handleLogin = async () => {
    setError('');

    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 이메일 로그인 API 호출
      await loginWithEmail(email, password);

      // 성공 시 세션 정리 및 홈으로 이동
      sessionStorage.removeItem('pendingEmail');
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && password && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {/* 이메일 표시 */}
      <div className="flex items-center gap-2 p-3 bg-[#ECECEC] rounded-lg mb-[10px]">
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
        onKeyDown={handleKeyDown}
        placeholder="비밀번호를 입력하세요"
        disabled={isLoading}
        showTooltip={false}
        showValidation={false}
      />

      {/* 에러 메시지 */}
      {error && (
        <p className="text-[#FF4242] text-sm">{error}</p>
      )}

      {/* 비밀번호 찾기 */}
      <button
        type="button"
        className="text-[16px] text-left mb-[10px]"
      >
        비밀번호를 잊으셨나요?
      </button>

      {/* 계속 버튼 */}
      <button
        onClick={handleLogin}
        disabled={!password || isLoading}
        className="w-full py-3 px-4 bg-[#000000] text-[#FFFFFF] disabled:bg-[#ECECEC] disabled:text-[#7F7F7F]
                   font-medium rounded-lg
                   transition-colors cursor-pointer disabled:cursor-default"
      >
        {isLoading ? '로그인 중...' : '계속'}
      </button>
    </div>
  );
}
