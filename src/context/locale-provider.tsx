'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

const translations = { en, tr };

type Locale = 'en' | 'tr';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('tr');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedLocale = localStorage.getItem('fpilot-locale') as Locale;
    if (storedLocale && ['en', 'tr'].includes(storedLocale)) {
      setLocaleState(storedLocale);
    }
    setIsMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fpilot-locale', newLocale);
    }
  };
  
  const t = (key: string): string => {
    if (!isMounted) return ''; // Prevent returning keys during server render/hydration mismatch
    const keys = key.split('.');
    let result: any = translations[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if key not found in current locale
        let fallbackResult: any = translations['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if(fallbackResult === undefined) return key;
        }
        return fallbackResult || key;
      }
    }
    return result || key;
  };
  
  const contextValue = useMemo(() => ({
    locale,
    setLocale,
    t,
  }), [locale, isMounted]);

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
