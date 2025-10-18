'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserMe } from '@/lib/api/user';
import Header from '@/components/layout/Header';

export default function CreateAccountComplete() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserMe();
        setNickname(user.nickname);
      } catch (err) {
        console.error('User info fetch error:', err);
        setError('사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleGoHome = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center px-[10px]">
        <div className="w-[330px] flex flex-col items-center gap-[60px] pt-[60px]">
          {/* 헤더 */}
          <div className="flex flex-col item-center text-center gap-[12px]">
            <h1 className="text-[24px] font-bold">
              {nickname}님<br /> 환영합니다
            </h1>
            <p className="text-[16px] text-[#2E2E2E]">
              교환학생 준비, 교환닷컴과 함께하세요.
            </p>
          </div>

          {/* 홈으로 버튼 */}
          <button
            onClick={handleGoHome}
            className="w-full py-3 px-4 bg-[#000000] text-[#FFFFFF]
                       font-medium rounded-lg
                       transition-colors cursor-pointer hover:bg-[#333333]"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
