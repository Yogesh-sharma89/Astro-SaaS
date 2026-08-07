// hooks/use-subscription — React Query hooks for subscription state.

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { useAuthStore } from '@/store/auth-store';

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'pro' | 'premium';
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  current_period_end: string | null;
  created_at: string;
}

async function fetchSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id, user_id, plan, status, current_period_end, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Subscription | null;
}

export function useSubscription() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: () => fetchSubscription(user!.id),
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  });
}

export function useInvalidateSubscription() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return () => queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
}

export function useIsPaid(): boolean {
  const { data: sub } = useSubscription();
  return sub?.status === 'active' && (sub.plan === 'pro' || sub.plan === 'premium');
}
