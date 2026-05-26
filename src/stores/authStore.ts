import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser, Credentials, Session } from '@/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      async login(credentials) {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message ?? 'Login failed.');
          }
          const session = (await res.json()) as Session;
          set({ user: session.user, token: session.token, isLoading: false });
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : 'Login failed.',
            isLoading: false,
          });
          throw e;
        }
      },

      async logout() {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } finally {
          set({ user: null, token: null, error: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'adminflow-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ user: s.user, token: s.token }),
    },
  ),
);
