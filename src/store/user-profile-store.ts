// store/ — Zustand stores for client-side state. One file per domain.
// user-profile-store: holds chart state locally; profile data is now read
// from Supabase via TanStack Query (useProfile hook).

import { create } from 'zustand';
import type { BirthChart } from '@/types';

interface ProfileState {
  chart: BirthChart | null;
  chartLoading: boolean;
  setChart: (chart: BirthChart | null) => void;
  setChartLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useUserProfileStore = create<ProfileState>((set) => ({
  chart: null,
  chartLoading: false,
  setChart: (chart) => set({ chart }),
  setChartLoading: (chartLoading) => set({ chartLoading }),
  reset: () => set({ chart: null, chartLoading: false }),
}));
