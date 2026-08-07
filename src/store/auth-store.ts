// store/ — Zustand stores for client-side state. One file per domain.
// auth-store: hydrates from the real Supabase session, not local mock state.

import { create } from 'zustand';
import type { Session, User } from '@/types';
import { authService } from '@/services/auth';

interface AuthState extends Session {
  hydrated: boolean;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
  setHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hydrated: false,
  setSession: (user, token) =>
    set({ user, token, isAuthenticated: true }),
  clearSession: () =>
    set({ user: null, token: null, isAuthenticated: false }),
  setHydrated: (hydrated) => set({ hydrated }),
}));

/**
 * Hydrate the auth store from the current Supabase session and subscribe
 * to future auth state changes. Called once at app startup.
 */
export async function initAuth() {
  const session = await authService.getSession();
  if (session) {
    setAuth(session.user, session.token);
  }
  useAuthStore.getState().setHydrated(true);

  authService.onAuthStateChange((user, token) => {
    if (user && token) {
      setAuth(user, token);
    } else {
      clearAuth();
    }
  });
}

function setAuth(user: User, token: string) {
  useAuthStore.getState().setSession(user, token);
}

function clearAuth() {
  useAuthStore.getState().clearSession();
}
