// services/ — API layer. One file per domain.
// birthChart.ts: CRUD for the birth_charts table via Supabase.

import { supabase } from './supabaseClient';
import type { BirthChart, UserProfile } from '@/types';
import { generateBirthChart as generateChart } from './astrology';

interface BirthChartRow {
  id: string;
  user_id: string;
  chart_data: BirthChart;
  generated_at: string;
}

export const birthChartService = {
  /** Fetch the user's stored birth chart, or null if none exists yet. */
  async getChart(userId: string): Promise<BirthChart | null> {
    const { data, error } = await supabase
      .from('birth_charts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return (data as BirthChartRow).chart_data;
  },

  /** Generate a new chart (stub math) and persist it to birth_charts. */
  async generateAndSave(userId: string, profile: UserProfile): Promise<BirthChart> {
    const chart = await generateChart(profile);
    const { error } = await supabase
      .from('birth_charts')
      .insert({
        user_id: userId,
        chart_data: chart,
      });
    if (error) throw new Error(error.message);
    return chart;
  },
};
