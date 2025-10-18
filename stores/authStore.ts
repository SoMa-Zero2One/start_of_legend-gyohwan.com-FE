import { create } from 'zustand';
import { getUserMe } from '@/lib/api/user';
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

  logout: () => {
    set({ user: null, isLoggedIn: false, isLoading: false });
    // TODO: 로그아웃 API 호출 추가
  },
}));
