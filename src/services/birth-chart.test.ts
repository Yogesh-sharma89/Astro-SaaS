// Tests for services/birth-chart.ts — birth chart persistence via Supabase.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/supabaseClient', () => {
  const chain = {
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn(),
  };
  return {
    supabase: {
      from: vi.fn(() => chain),
    },
  };
});

vi.mock('@/services/astrology', () => ({
  generateBirthChart: vi.fn().mockResolvedValue({
    id: 'chart-1',
    sunSign: 'Virgo',
    moonSign: 'Aries',
    ascendant: 'Sagittarius',
    birthTimeKnown: true,
    houses: [],
    planets: [],
    generatedAt: '2024-01-01T00:00:00Z',
  }),
}));

import { supabase } from '@/services/supabaseClient';
import { birthChartService } from '@/services/birth-chart';
import type { UserProfile } from '@/types';

function makeProfile(): UserProfile {
  return {
    name: 'Jane',
    gender: 'female',
    language: 'English',
    birthDate: '1990-08-24',
    birthTime: '10:30',
    birthTimeUnknown: false,
    birthPlace: 'New York',
    latitude: 40.71,
    longitude: -74.0,
    timezone: 'America/New_York',
    relationshipStatus: 'single',
    goals: [],
    interests: [],
    onboardingComplete: true,
  };
}

describe('birthChartService.getChart', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns chart_data when a row exists', async () => {
    const chartData = { id: 'c1', sunSign: 'Virgo', moonSign: 'Aries', ascendant: 'Sagittarius', birthTimeKnown: true, houses: [], planets: [], generatedAt: '2024-01-01T00:00:00Z' };
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { chart_data: chartData }, error: null }),
    });

    const result = await birthChartService.getChart('user-1');
    expect(result).not.toBeNull();
    expect(result!.sunSign).toBe('Virgo');
  });

  it('returns null when no chart exists', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    const result = await birthChartService.getChart('user-1');
    expect(result).toBeNull();
  });

  it('throws on supabase error', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: 'Denied' } }),
    });

    await expect(birthChartService.getChart('user-1')).rejects.toThrow('Denied');
  });
});

describe('birthChartService.generateAndSave', () => {
  beforeEach(() => vi.clearAllMocks());

  it('generates a chart and inserts it into birth_charts', async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: insertMock,
    });

    const chart = await birthChartService.generateAndSave('user-1', makeProfile());
    expect(chart.sunSign).toBe('Virgo');
    expect(insertMock).toHaveBeenCalledWith({
      user_id: 'user-1',
      chart_data: expect.objectContaining({ sunSign: 'Virgo' }),
    });
  });

  it('throws when insert fails', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: { message: 'Insert failed' } }),
    });

    await expect(birthChartService.generateAndSave('user-1', makeProfile())).rejects.toThrow('Insert failed');
  });
});
