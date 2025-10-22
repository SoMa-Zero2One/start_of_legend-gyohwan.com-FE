import { create } from 'zustand';
import { getUserMe } from '@/lib/api/user';
import { logout as apiLogout } from '@/lib/api/auth';
import { clearRedirectUrl } from '@/lib/utils/redirect';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

interface AuthActions {
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  // State
  user: null,
  isLoading: true,
  isLoggedIn: false,

  // Actions
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const user = await getUserMe();
      set({ user, isLoggedIn: true, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      set({ user: null, isLoggedIn: false, isLoading: false });
    }
  },

  setUser: (user) => {
    set({ user, isLoggedIn: !!user, isLoading: false });
  },

  logout: async () => {
    try {
      await apiLogout();
      clearRedirectUrl(); // 로그아웃 시 저장된 리다이렉트 URL 삭제
      set({ user: null, isLoggedIn: false, isLoading: false });
    } catch (error) {
      console.error('Failed to logout:', error);
      // 로그아웃 API 실패해도 클라이언트 상태는 초기화
      clearRedirectUrl();
      set({ user: null, isLoggedIn: false, isLoading: false });
    }
  },
}));
