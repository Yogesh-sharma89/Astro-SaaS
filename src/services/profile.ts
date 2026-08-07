// services/ — API layer. One file per domain.
// profile.ts: CRUD for the profiles table via Supabase.

import { supabase } from './supabaseClient';
import type { UserProfile } from '@/types';

/** Row shape in the profiles table — snake_case from Postgres. */
export interface ProfileRow {
  id: string;
  name: string | null;
  gender: string | null;
  birth_date: string | null;
  birth_time: string | null;
  birth_place: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  relationship_status: string | null;
  goals: string[] | null;
  interests: string[] | null;
  onboarding_completed: boolean;
  created_at: string;
}

function rowToProfile(row: ProfileRow): UserProfile {
  return {
    name: row.name ?? '',
    gender: (row.gender as UserProfile['gender']) ?? 'prefer-not',
    language: 'English',
    birthDate: row.birth_date ?? '',
    birthTime: row.birth_time ?? '',
    birthTimeUnknown: !row.birth_time,
    birthPlace: row.birth_place ?? '',
    latitude: row.latitude,
    longitude: row.longitude,
    timezone: row.timezone,
    relationshipStatus: (row.relationship_status as UserProfile['relationshipStatus']) ?? 'prefer-not',
    goals: row.goals ?? [],
    interests: row.interests ?? [],
    onboardingComplete: row.onboarding_completed,
  };
}

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return rowToProfile(data as ProfileRow);
  },

  async upsertProfile(userId: string, profile: UserProfile): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name: profile.name,
        gender: profile.gender,
        birth_date: profile.birthDate,
        birth_time: profile.birthTimeUnknown ? null : profile.birthTime,
        birth_place: profile.birthPlace,
        latitude: profile.latitude,
        longitude: profile.longitude,
        timezone: profile.timezone,
        relationship_status: profile.relationshipStatus,
        goals: profile.goals,
        interests: profile.interests,
        onboarding_completed: true,
      });
    if (error) throw new Error(error.message);
  },
};
