// i18n/ — React context provider for language switching.

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { translations, DEFAULT_LANGUAGE, type Language, type TranslationTree } from './translations';

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationTree;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'astralis-lang';

function getInitialLang(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in translations) return stored as Language;
  return DEFAULT_LANGUAGE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value: I18nContextValue = {
    lang,
    setLang,
    t: translations[lang],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
