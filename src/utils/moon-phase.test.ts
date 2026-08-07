// Tests for utils/moon-phase.ts — pure astronomical calculation.

import { describe, it, expect } from 'vitest';
import { getMoonPhase } from '@/utils/moon-phase';

describe('getMoonPhase', () => {
  it('returns an object with phase, emoji, illumination, and age', () => {
    const result = getMoonPhase(new Date('2024-01-15T12:00:00Z'));
    expect(result).toHaveProperty('phase');
    expect(result).toHaveProperty('emoji');
    expect(result).toHaveProperty('illumination');
    expect(result).toHaveProperty('age');
    expect(typeof result.phase).toBe('string');
    expect(typeof result.emoji).toBe('string');
    expect(typeof result.illumination).toBe('number');
    expect(typeof result.age).toBe('number');
  });

  it('returns illumination between 0 and 100', () => {
    for (let i = 0; i < 30; i++) {
      const d = new Date(2024, 0, i + 1);
      const result = getMoonPhase(d);
      expect(result.illumination).toBeGreaterThanOrEqual(0);
      expect(result.illumination).toBeLessThanOrEqual(100);
    }
  });

  it('returns age between 0 and ~29.5', () => {
    for (let i = 0; i < 30; i++) {
      const d = new Date(2024, 0, i + 1);
      const result = getMoonPhase(d);
      expect(result.age).toBeGreaterThanOrEqual(0);
      expect(result.age).toBeLessThan(30);
    }
  });

  it('returns a valid phase name', () => {
    const validPhases = [
      'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
      'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
    ];
    const result = getMoonPhase(new Date());
    expect(validPhases).toContain(result.phase);
  });

  it('returns a valid emoji', () => {
    const validEmojis = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    const result = getMoonPhase(new Date());
    expect(validEmojis).toContain(result.emoji);
  });

  it('uses current date when no argument is passed', () => {
    const result = getMoonPhase();
    expect(result.illumination).toBeGreaterThanOrEqual(0);
    expect(result.age).toBeGreaterThanOrEqual(0);
  });

  it('produces consistent results for the same date', () => {
    const d = new Date('2024-06-15T12:00:00Z');
    const r1 = getMoonPhase(d);
    const r2 = getMoonPhase(d);
    expect(r1).toEqual(r2);
  });
});
