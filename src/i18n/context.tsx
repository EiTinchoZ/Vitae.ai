'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { LanguageCode, defaultLanguage, languages } from './config';

import es from './locales/es.json';
import en from './locales/en.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import ko from './locales/ko.json';

type TranslationData = typeof es;

const translations: Record<string, TranslationData> = {
  es,
  en,
  pt,
  de,
  fr,
  zh,
  ja,
  ar,
  hi,
  ko,
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
  dir: 'ltr' | 'rtl';
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'vitae-language';

function getNestedRawValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  const keys = path.split('.');
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return value;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && languages.some((l) => l.code === stored)) {
      setLanguageState(stored);
    }
    setIsLoading(false);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);

    const langConfig = languages.find((l) => l.code === lang);
    if (langConfig) {
      document.documentElement.lang = lang;
      document.documentElement.dir = langConfig.dir;
    }
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language] || translations.es;
    const value = getNestedRawValue(
      currentTranslations as unknown as Record<string, unknown>,
      key
    );
    return typeof value === 'string' ? value : key;
  };

  const tArray = (key: string): string[] => {
    const currentTranslations = translations[language] || translations.es;
    const value = getNestedRawValue(
      currentTranslations as unknown as Record<string, unknown>,
      key
    );
    return Array.isArray(value) ? value.map(String) : [];
  };

  const dir = languages.find((l) => l.code === language)?.dir || 'ltr';

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, tArray, dir, isLoading }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, tArray, language, dir } = useLanguage();
  return { t, tArray, language, dir };
}
