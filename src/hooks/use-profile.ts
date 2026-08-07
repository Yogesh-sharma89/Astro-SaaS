// hooks/ — custom React hooks shared across features.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/profile';
import { useAuthStore } from '@/store/auth-store';
import type { UserProfile } from '@/types';

export function useProfile() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => profileService.getProfile(user!.id),
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });
}

export function useUpsertProfile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: (profile: UserProfile) => profileService.upsertProfile(user!.id, profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });
}
