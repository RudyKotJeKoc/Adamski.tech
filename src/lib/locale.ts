import { useEffect, useState } from 'react';
import type { Locale } from '../components';

export const LOCALES: Locale[] = ['pl', 'en', 'nl'];

const readStoredLocale = (): Locale | null => {
  try {
    const stored = localStorage.getItem('locale');
    return stored && (LOCALES as string[]).includes(stored) ? (stored as Locale) : null;
  } catch {
    return null;
  }
};

export const detectLocale = (): Locale => {
  const stored = readStoredLocale();
  if (stored) return stored;
  const browser = (typeof navigator !== 'undefined' ? navigator.language || 'pl' : 'pl').slice(0, 2);
  return (LOCALES as string[]).includes(browser) ? (browser as Locale) : 'pl';
};

/** Ten sam mechanizm co w App.tsx (localStorage "locale"), współdzielony przez podstrony. */
export const useSiteLocale = () => {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  useEffect(() => {
    try {
      localStorage.setItem('locale', locale);
    } catch {
      /* tryb prywatny — wybór języka działa do końca sesji */
    }
    document.documentElement.lang = locale;
  }, [locale]);

  return [locale, setLocale] as const;
};
