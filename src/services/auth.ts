// services/ — API layer. One file per domain.
// auth.ts: real Supabase Auth integration. Same function signatures as the stub.

import { supabase } from './supabaseClient';
import type { AuthResponse, User } from '@/types';

function mapUser(supabaseUser: {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: { name?: string };
}): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    name: supabaseUser.user_metadata?.name ?? supabaseUser.email?.split('@')[0] ?? 'User',
    createdAt: supabaseUser.created_at ?? new Date().toISOString(),
  };
}

export const authService = {
  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Signup failed — no user returned');
    return { user: mapUser(data.user), token: data.session?.access_token ?? '' };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('email_not_confirmed')) {
        throw new Error('Please confirm your email before logging in. Check your inbox for a confirmation link.');
      }
      throw new Error(error.message);
    }
    if (!data.user) throw new Error('Login failed — no user returned');
    return { user: mapUser(data.user), token: data.session?.access_token ?? '' };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getSession(): Promise<AuthResponse | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    return { user: mapUser(session.user), token: session.access_token };
  },

  onAuthStateChange(callback: (user: User | null, token: string | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          callback(mapUser(session.user), session.access_token);
        } else {
          callback(null, null);
        }
      })();
    });
  },
};
