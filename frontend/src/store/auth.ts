import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, AdminUser } from '../api/auth';

interface AuthState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string, admin: AdminUser) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          set({
            token: response.data.token,
            admin: response.data.admin,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('auth_token', response.data.token);
        } catch (error) {
          set({
            error: 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('auth_token');
      },

      setToken: (token: string, admin: AdminUser) => {
        set({
          token,
          admin,
          isAuthenticated: true,
        });
        localStorage.setItem('auth_token', token);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, admin: state.admin }),
    }
  )
);
