import { create } from "zustand";
import { getUserMe } from "@/lib/api/user";
import { logout as apiLogout } from "@/lib/api/auth";
import { handleApiError } from "@/lib/utils/apiError";
import { clearRedirectUrl } from "@/lib/utils/redirect";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

type LogoutOptions = { force?: boolean };
type LogoutResult = { ok: true } | { ok: false; message: string };

interface AuthActions {
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: (options?: LogoutOptions) => Promise<LogoutResult>;
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
      if (!user) {
        set({ user: null, isLoggedIn: false, isLoading: false });
        return;
      }
      set({ user, isLoggedIn: true, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      set({ user: null, isLoggedIn: false, isLoading: false });
    }
  },

  setUser: (user) => {
    set({ user, isLoggedIn: !!user, isLoading: false });
  },

  logout: async (options) => {
    try {
      await apiLogout();
      clearRedirectUrl(); // 로그아웃 시 저장된 리다이렉트 URL 삭제
      set({ user: null, isLoggedIn: false, isLoading: false });
      return { ok: true };
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Failed to logout:", errorMessage);
      // 실패 시에는 로그인 상태 유지 (force 옵션이면 상태 초기화)
      if (options?.force) {
        clearRedirectUrl();
        set({ user: null, isLoggedIn: false, isLoading: false });
      }
      return { ok: false, message: errorMessage };
    }
  },
}));

// 앱 초기화 시 자동으로 사용자 정보 가져오기
if (typeof window !== "undefined") {
  useAuthStore.getState().fetchUser();
}
