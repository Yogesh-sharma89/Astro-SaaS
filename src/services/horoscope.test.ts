// Tests for services/horoscope.ts — daily horoscope generation.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { getTodayHoroscope } from '@/services/horoscope';
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

describe('getTodayHoroscope', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a DailyHoroscope with all required fields', async () => {
    const result = await getTodayHoroscope(makeProfile());
    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('sign');
    expect(result).toHaveProperty('general');
    expect(result).toHaveProperty('love');
    expect(result).toHaveProperty('career');
    expect(result).toHaveProperty('health');
    expect(result).toHaveProperty('luckyColor');
    expect(result).toHaveProperty('luckyNumber');
    expect(result).toHaveProperty('luckyTime');
    expect(result).toHaveProperty('mood');
    expect(result).toHaveProperty('quote');
    expect(result).toHaveProperty('guidance');
  });

  it('returns date as today\'s ISO date', async () => {
    const result = await getTodayHoroscope(makeProfile());
    const today = new Date().toISOString().split('T')[0];
    expect(result.date).toBe(today);
  });

  it('returns a valid zodiac sign', async () => {
    const result = await getTodayHoroscope(makeProfile());
    const validSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    expect(validSigns).toContain(result.sign);
  });

  it('returns luckyNumber between 1 and 9', async () => {
    const result = await getTodayHoroscope(makeProfile());
    expect(result.luckyNumber).toBeGreaterThanOrEqual(1);
    expect(result.luckyNumber).toBeLessThanOrEqual(9);
  });

  it('returns non-empty text fields', async () => {
    const result = await getTodayHoroscope(makeProfile());
    expect(result.general.length).toBeGreaterThan(10);
    expect(result.love.length).toBeGreaterThan(10);
    expect(result.career.length).toBeGreaterThan(10);
    expect(result.health.length).toBeGreaterThan(10);
    expect(result.quote.length).toBeGreaterThan(10);
    expect(result.guidance.length).toBeGreaterThan(10);
  });

  it('returns deterministic output for same day and profile', async () => {
    const r1 = await getTodayHoroscope(makeProfile());
    const r2 = await getTodayHoroscope(makeProfile());
    expect(r1.luckyColor).toBe(r2.luckyColor);
    expect(r1.luckyNumber).toBe(r2.luckyNumber);
    expect(r1.mood).toBe(r2.mood);
    expect(r1.quote).toBe(r2.quote);
  });

  it('returns different output for different names', async () => {
    const profile2 = makeProfile();
    profile2.name = 'DifferentNameXYZ';
    const r1 = await getTodayHoroscope(makeProfile());
    const r2 = await getTodayHoroscope(profile2);
    const anyDifferent = r1.luckyColor !== r2.luckyColor ||
      r1.luckyNumber !== r2.luckyNumber ||
      r1.mood !== r2.mood;
    expect(anyDifferent).toBe(true);
  });

  it('returns valid luckyTime format', async () => {
    const result = await getTodayHoroscope(makeProfile());
    expect(result.luckyTime).toMatch(/^\d{1,2}:00 (AM|PM)$/);
  });
});
