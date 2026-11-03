'use client';

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  ReactNode,
} from 'react';
import { LanguageCode, defaultLanguage, languages } from './config';

import es from './locales/es.json';
import en from './locales/en.json';

type TranslationData = typeof es;

const translations: Record<LanguageCode, TranslationData> = {
  es,
  en,
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'vitae-language';

const subscribe = () => () => {};

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
  const storedLang = useSyncExternalStore(
    subscribe,
    () => {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      return stored && languages.some((l) => l.code === stored) ? stored : null;
    },
    () => null
  );
  const [language, setLanguageState] = useState<LanguageCode>(storedLang ?? defaultLanguage);
  const isLoading = useSyncExternalStore(subscribe, () => false, () => true);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);

    const langConfig = languages.find((l) => l.code === lang);
    if (langConfig) {
      document.documentElement.lang = lang;
      document.documentElement.dir = 'ltr';
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

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, tArray, isLoading }}
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
  const { t, tArray, language } = useLanguage();
  return { t, tArray, language };
}
