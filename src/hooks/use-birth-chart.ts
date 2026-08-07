// hooks/ — custom React hooks shared across features.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { birthChartService } from '@/services/birth-chart';
import { useAuthStore } from '@/store/auth-store';
import { useProfile } from './use-profile';

export function useBirthChart() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();
  return useQuery({
    queryKey: ['birthChart', user?.id],
    queryFn: () => birthChartService.getChart(user!.id),
    enabled: !!user?.id && !!profile?.onboardingComplete,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGenerateBirthChart() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();
  return useMutation({
    mutationFn: () => birthChartService.generateAndSave(user!.id, profile!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthChart', user?.id] });
    },
  });
}
