// Tests for services/profile.ts — Supabase profiles CRUD.

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabaseClient before importing profileService
vi.mock('@/services/supabaseClient', () => {
  const chain = {
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
    select: vi.fn().mockReturnThis(),
    upsert: vi.fn(),
  };
  return {
    supabase: {
      from: vi.fn(() => chain),
    },
  };
});

import { supabase } from '@/services/supabaseClient';
import { profileService } from '@/services/profile';
import type { UserProfile } from '@/types';

function makeProfile(): UserProfile {
  return {
    name: 'Jane Doe',
    gender: 'female',
    language: 'English',
    birthDate: '1990-08-24',
    birthTime: '10:30',
    birthTimeUnknown: false,
    birthPlace: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
    relationshipStatus: 'single',
    goals: ['Self-discovery'],
    interests: ['Zodiac signs'],
    onboardingComplete: false,
  };
}

describe('profileService.getProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a UserProfile when row exists', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          id: 'user-1',
          name: 'Jane',
          gender: 'female',
          birth_date: '1990-08-24',
          birth_time: '10:30',
          birth_place: 'New York',
          latitude: 40.71,
          longitude: -74.0,
          timezone: 'America/New_York',
          relationship_status: 'single',
          goals: ['Self-discovery'],
          interests: ['Zodiac signs'],
          onboarding_completed: true,
          created_at: '2024-01-01T00:00:00Z',
        },
        error: null,
      }),
    });

    const result = await profileService.getProfile('user-1');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('Jane');
    expect(result!.birthDate).toBe('1990-08-24');
    expect(result!.birthTime).toBe('10:30');
    expect(result!.birthTimeUnknown).toBe(false);
    expect(result!.latitude).toBe(40.71);
    expect(result!.longitude).toBe(-74.0);
    expect(result!.onboardingComplete).toBe(true);
  });

  it('returns null when no row exists', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    const result = await profileService.getProfile('nonexistent');
    expect(result).toBeNull();
  });

  it('throws when supabase returns an error', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: 'RLS denied' } }),
    });

    await expect(profileService.getProfile('user-1')).rejects.toThrow('RLS denied');
  });

  it('sets birthTimeUnknown=true when birth_time is null', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          id: 'user-1',
          name: 'Jane',
          gender: null,
          birth_date: '1990-08-24',
          birth_time: null,
          birth_place: 'New York',
          latitude: null,
          longitude: null,
          timezone: null,
          relationship_status: null,
          goals: null,
          interests: null,
          onboarding_completed: false,
          created_at: '2024-01-01T00:00:00Z',
        },
        error: null,
      }),
    });

    const result = await profileService.getProfile('user-1');
    expect(result!.birthTimeUnknown).toBe(true);
    expect(result!.birthTime).toBe('');
    expect(result!.goals).toEqual([]);
    expect(result!.interests).toEqual([]);
  });
});

describe('profileService.upsertProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('upserts profile data with snake_case mapping', async () => {
    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      upsert: upsertMock,
    });

    await profileService.upsertProfile('user-1', makeProfile());

    expect(upsertMock).toHaveBeenCalledWith({
      id: 'user-1',
      name: 'Jane Doe',
      gender: 'female',
      birth_date: '1990-08-24',
      birth_time: '10:30',
      birth_place: 'New York, NY',
      latitude: 40.7128,
      longitude: -74.006,
      timezone: 'America/New_York',
      relationship_status: 'single',
      goals: ['Self-discovery'],
      interests: ['Zodiac signs'],
      onboarding_completed: true,
    });
  });

  it('sets birth_time to null when birthTimeUnknown is true', async () => {
    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      upsert: upsertMock,
    });

    const profile = makeProfile();
    profile.birthTimeUnknown = true;

    await profileService.upsertProfile('user-1', profile);

    const arg = upsertMock.mock.calls[0][0];
    expect(arg.birth_time).toBeNull();
  });

  it('throws when supabase returns an error', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      upsert: vi.fn().mockResolvedValue({ error: { message: 'Permission denied' } }),
    });

    await expect(profileService.upsertProfile('user-1', makeProfile())).rejects.toThrow('Permission denied');
  });
});
