// Tests for onboarding schemas — Zod validation for each step.

import { describe, it, expect } from 'vitest';
import { step1Schema, step2Schema, step3Schema } from '@/features/onboarding/schemas';

describe('step1Schema', () => {
  it('validates a correct step 1 input', () => {
    const result = step1Schema.safeParse({
      name: 'Jane',
      gender: 'female',
      language: 'English',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = step1Schema.safeParse({ name: '', gender: 'female', language: 'English' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid gender', () => {
    const result = step1Schema.safeParse({ name: 'Jane', gender: 'invalid', language: 'English' });
    expect(result.success).toBe(false);
  });

  it('rejects empty language', () => {
    const result = step1Schema.safeParse({ name: 'Jane', gender: 'female', language: '' });
    expect(result.success).toBe(false);
  });
});

describe('step2Schema', () => {
  it('validates with birth time provided', () => {
    const result = step2Schema.safeParse({
      birthDate: '1990-08-24',
      birthTime: '10:30',
      birthTimeUnknown: false,
      birthPlace: 'New York',
      latitude: 40.71,
      longitude: -74.0,
    });
    expect(result.success).toBe(true);
  });

  it('validates with birthTimeUnknown=true and no birth time', () => {
    const result = step2Schema.safeParse({
      birthDate: '1990-08-24',
      birthTime: '',
      birthTimeUnknown: true,
      birthPlace: 'New York',
      latitude: null,
      longitude: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty birthDate', () => {
    const result = step2Schema.safeParse({
      birthDate: '',
      birthTime: '10:30',
      birthTimeUnknown: false,
      birthPlace: 'New York',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty birthPlace', () => {
    const result = step2Schema.safeParse({
      birthDate: '1990-08-24',
      birthTime: '10:30',
      birthTimeUnknown: false,
      birthPlace: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when birthTime is missing and birthTimeUnknown is false', () => {
    const result = step2Schema.safeParse({
      birthDate: '1990-08-24',
      birthTime: '',
      birthTimeUnknown: false,
      birthPlace: 'New York',
    });
    expect(result.success).toBe(false);
  });
});

describe('step3Schema', () => {
  it('validates correct step 3 input', () => {
    const result = step3Schema.safeParse({
      relationshipStatus: 'single',
      goals: ['Self-discovery'],
      interests: ['Zodiac signs'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty goals array', () => {
    const result = step3Schema.safeParse({
      relationshipStatus: 'single',
      goals: [],
      interests: ['Zodiac signs'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty interests array', () => {
    const result = step3Schema.safeParse({
      relationshipStatus: 'single',
      goals: ['Self-discovery'],
      interests: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid relationshipStatus', () => {
    const result = step3Schema.safeParse({
      relationshipStatus: 'invalid',
      goals: ['Self-discovery'],
      interests: ['Zodiac signs'],
    });
    expect(result.success).toBe(false);
  });
});
