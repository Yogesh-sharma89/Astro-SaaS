// Tests for i18n/ — translation system.

import { describe, it, expect } from 'vitest';
import { translations, LANGUAGES, type Language, type TranslationTree } from '@/i18n/translations';

const LANG_CODES = Object.keys(translations) as Language[];

describe('translations', () => {
  it('has 4 languages', () => {
    expect(LANG_CODES).toHaveLength(4);
    expect(LANG_CODES).toContain('en');
    expect(LANG_CODES).toContain('hi');
    expect(LANG_CODES).toContain('mr');
    expect(LANG_CODES).toContain('ta');
  });

  it('LANGUAGES array matches translation keys', () => {
    expect(LANGUAGES.map((l) => l.code).sort()).toEqual([...LANG_CODES].sort());
  });

  it('each language has nativeLabel', () => {
    for (const lang of LANGUAGES) {
      expect(lang.nativeLabel).toBeTruthy();
      expect(typeof lang.nativeLabel).toBe('string');
    }
  });
});

// Recursively check that all keys in `en` exist in every other language
function getKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getKeys(value as Record<string, unknown>, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

describe('translation completeness', () => {
  const enKeys = getKeys(translations.en as unknown as Record<string, unknown>);

  for (const lang of LANG_CODES) {
    if (lang === 'en') continue;
    it(`${lang} has all keys from English`, () => {
      const langKeys = getKeys(translations[lang] as unknown as Record<string, unknown>);
      const missing = enKeys.filter((k) => !langKeys.includes(k));
      expect(missing).toEqual([]);
    });

    it(`${lang} has no extra keys`, () => {
      const langKeys = getKeys(translations[lang] as unknown as Record<string, unknown>);
      const extra = langKeys.filter((k) => !enKeys.includes(k));
      expect(extra).toEqual([]);
    });
  }
});

describe('translation values', () => {
  for (const lang of LANG_CODES) {
    it(`${lang}: all string values are non-empty`, () => {
      const keys = getKeys(translations[lang] as unknown as Record<string, unknown>);
      for (const key of keys) {
        const parts = key.split('.');
        let val: unknown = translations[lang];
        for (const part of parts) {
          val = (val as Record<string, unknown>)[part];
        }
        expect(typeof val).toBe('string');
        expect((val as string).length).toBeGreaterThan(0);
      }
    });
  }
});
