'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import ProfileIcon from '@/components/icons/ProfileIcon';

export default function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Selector를 사용하여 필요한 값만 구독
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* 프로필 버튼 */}
      <button
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="cursor-pointer"
      >
        <ProfileIcon profileUrl={user?.profileUrl} size={32} />
      </button>

      {/* Dropdown 메뉴 */}
      {isMenuOpen && (
        <div className="absolute right-0 top-[42px] w-[100px] h-[84px] p-[12px] bg-white shadow-md border border-[#ECECEC] rounded-[10px] flex flex-col items-center justify-between text-[14px] font-medium z-50">
          <Link href="/my-page" className="w-full text-center">
            내 정보 관리
          </Link>
          <button
            className="w-full cursor-pointer"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
