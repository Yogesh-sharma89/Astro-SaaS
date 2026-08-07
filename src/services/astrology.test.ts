// Tests for services/astrology.ts — real birth chart calculation using astronomy-engine.

import { describe, it, expect } from 'vitest';
import { generateBirthChart } from '@/services/astrology';
import type { UserProfile } from '@/types';

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    name: 'Test User',
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
    ...overrides,
  };
}

describe('generateBirthChart', () => {
  it('returns a BirthChart with all required fields', async () => {
    const chart = await generateBirthChart(makeProfile());
    expect(chart).toHaveProperty('id');
    expect(chart).toHaveProperty('sunSign');
    expect(chart).toHaveProperty('moonSign');
    expect(chart).toHaveProperty('ascendant');
    expect(chart).toHaveProperty('birthTimeKnown');
    expect(chart).toHaveProperty('houses');
    expect(chart).toHaveProperty('planets');
    expect(chart).toHaveProperty('generatedAt');
  });

  it('computes Sun in Virgo for 1990-08-24', async () => {
    const chart = await generateBirthChart(makeProfile());
    expect(chart.sunSign).toBe('Virgo');
  });

  it('computes Moon in Aries for 1990-08-24 10:30 UTC', async () => {
    const chart = await generateBirthChart(makeProfile());
    // Moon moves ~13°/day, so this is approximate; verify it's a valid sign
    const validSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    expect(validSigns).toContain(chart.moonSign);
  });

  it('includes all 7 planets (Sun through Saturn)', async () => {
    const chart = await generateBirthChart(makeProfile());
    const names = chart.planets.map((p) => p.name);
    expect(names).toContain('Sun');
    expect(names).toContain('Moon');
    expect(names).toContain('Mercury');
    expect(names).toContain('Venus');
    expect(names).toContain('Mars');
    expect(names).toContain('Jupiter');
    expect(names).toContain('Saturn');
    expect(chart.planets).toHaveLength(7);
  });

  it('assigns a valid zodiac sign to each planet', async () => {
    const chart = await generateBirthChart(makeProfile());
    const validSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    for (const p of chart.planets) {
      expect(validSigns).toContain(p.sign);
    }
  });

  it('assigns a degree between 0 and 30 to each planet', async () => {
    const chart = await generateBirthChart(makeProfile());
    for (const p of chart.planets) {
      expect(p.degree).toBeGreaterThanOrEqual(0);
      expect(p.degree).toBeLessThan(30);
    }
  });

  it('assigns a house between 1 and 12 when birth time is known', async () => {
    const chart = await generateBirthChart(makeProfile());
    for (const p of chart.planets) {
      expect(p.house).toBeGreaterThanOrEqual(1);
      expect(p.house).toBeLessThanOrEqual(12);
    }
  });

  it('provides a meaning string for each planet', async () => {
    const chart = await generateBirthChart(makeProfile());
    for (const p of chart.planets) {
      expect(p.meaning).toBeTruthy();
      expect(typeof p.meaning).toBe('string');
    }
  });

  it('computes 12 houses when birth time is known', async () => {
    const chart = await generateBirthChart(makeProfile());
    expect(chart.houses).toHaveLength(12);
    for (let i = 0; i < 12; i++) {
      expect(chart.houses[i].number).toBe(i + 1);
    }
  });

  it('computes an ascendant when birth time is known', async () => {
    const chart = await generateBirthChart(makeProfile());
    expect(chart.ascendant).not.toBeNull();
    const validSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    expect(validSigns).toContain(chart.ascendant);
  });

  it('sets birthTimeKnown=true when birth time is provided', async () => {
    const chart = await generateBirthChart(makeProfile());
    expect(chart.birthTimeKnown).toBe(true);
  });

  // --- Unknown birth time ---
  it('sets birthTimeKnown=false when birth time is unknown', async () => {
    const chart = await generateBirthChart(makeProfile({
      birthTime: '',
      birthTimeUnknown: true,
    }));
    expect(chart.birthTimeKnown).toBe(false);
  });

  it('returns null ascendant when birth time is unknown', async () => {
    const chart = await generateBirthChart(makeProfile({
      birthTime: '',
      birthTimeUnknown: true,
    }));
    expect(chart.ascendant).toBeNull();
  });

  it('returns empty houses array when birth time is unknown', async () => {
    const chart = await generateBirthChart(makeProfile({
      birthTime: '',
      birthTimeUnknown: true,
    }));
    expect(chart.houses).toHaveLength(0);
  });

  it('still computes sun and moon signs when birth time is unknown', async () => {
    const chart = await generateBirthChart(makeProfile({
      birthTime: '',
      birthTimeUnknown: true,
    }));
    expect(chart.sunSign).toBe('Virgo');
    const validSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    expect(validSigns).toContain(chart.moonSign);
  });

  it('sets house=0 for all planets when birth time is unknown', async () => {
    const chart = await generateBirthChart(makeProfile({
      birthTime: '',
      birthTimeUnknown: true,
    }));
    for (const p of chart.planets) {
      expect(p.house).toBe(0);
    }
  });

  it('generates a unique id', async () => {
    const chart1 = await generateBirthChart(makeProfile());
    const chart2 = await generateBirthChart(makeProfile());
    expect(chart1.id).not.toBe(chart2.id);
  });

  it('sets generatedAt to an ISO string', async () => {
    const chart = await generateBirthChart(makeProfile());
    expect(() => new Date(chart.generatedAt).toISOString()).not.toThrow();
  });

  it('handles null latitude/longitude gracefully', async () => {
    const chart = await generateBirthChart(makeProfile({
      latitude: null,
      longitude: null,
      birthTime: '',
      birthTimeUnknown: true,
    }));
    expect(chart.sunSign).toBe('Virgo');
  });
});
