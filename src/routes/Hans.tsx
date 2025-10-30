import React, { useEffect, useMemo, useState } from 'react';
import { LanguageSwitcher, Locale } from '../components';

const setRouteMeta = (title: string, description: string, path: string, locale: Locale) => {
  document.title = title;
  const descTag = document.querySelector('meta[name="description"]');
  if (descTag) descTag.setAttribute('content', description);

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = `${location.origin}${path}`;

  const existing = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]'));
  existing.forEach((el) => el.remove());
  (['pl', 'en', 'nl'] as Locale[]).forEach((l) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = l;
    const qs = new URLSearchParams(location.search);
    qs.set('hl', l);
    link.href = `${location.origin}${path}?${qs.toString()}`;
    document.head.appendChild(link);
  });

  document.documentElement.lang = locale;
};

const Hans: React.FC = () => {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    const browser = (navigator.language || 'pl').slice(0, 2) as Locale;
    return stored ?? (['pl', 'en', 'nl'].includes(browser) ? browser : 'pl');
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    const titles: Record<Locale, string> = {
      pl: 'Adamski.tech — Landing partnerski (Hans)',
      en: 'Adamski.tech — Partner landing (Hans)',
      nl: 'Adamski.tech — Partnerlanding (Hans)'
    };
    const descs: Record<Locale, string> = {
      pl: 'Krótki landing partnerski dla Hansa: przegląd B2B i kontakt. UTM zachowane.',
      en: 'Short partner landing for Hans: B2B overview and contact. UTM preserved.',
      nl: 'Korte partnerlanding voor Hans: B2B-overzicht en contact. UTM behouden.'
    };
    setRouteMeta(titles[locale], descs[locale], '/hans', locale);
  }, [locale]);

  const search = location.search;
  const projectsHref = useMemo(() => `/${search}#projects`, [search]);

  return (
    <main className="max-w-screen-sm mx-auto px-4 md:px-8 lg:px-12 py-12">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-heading font-semibold text-neutral-50">
          {locale === 'pl' ? 'Daremon Engineering — Partner' : locale === 'en' ? 'Daremon Engineering — Partner' : 'Daremon Engineering — Partner'}
        </h1>
        <p className="text-neutral-300 mt-2">
          {locale === 'pl'
            ? 'Witaj Hans! Poniżej znajdziesz skrót usług B2B oraz link do projektów. Skontaktuj się, jeśli chcesz omówić modernizacje lub automatyzacje.'
            : locale === 'en'
            ? 'Hi Hans! Below is a short B2B overview and a link to projects. Get in touch to discuss upgrades or automation.'
            : 'Hoi Hans! Hieronder vind je een korte B2B-overzicht en een link naar projecten. Neem contact op voor upgrades of automatisering.'}
        </p>
      </header>

      <div className="flex items-center justify-between mb-8">
        <LanguageSwitcher locale={locale} onChange={setLocale} />
      </div>

      <section className="grid gap-4">
        <a href={projectsHref} className="px-5 py-3 rounded-button border border-primary-600 text-primary-50 !bg-transparent !hover:bg-transparent hover:text-white">
          {locale === 'pl' ? 'Projekty B2B' : locale === 'en' ? 'B2B Projects' : 'B2B Projecten'}
        </a>
        <a href="mailto:Dariusz@Adamski.tech?subject=Partner%20inquiry%20—%20Hans" className="px-5 py-3 rounded-button border border-accent-blue_tech text-accent-blue_tech !bg-transparent !hover:bg-transparent hover:text-white">
          {locale === 'pl' ? 'Kontakt' : locale === 'en' ? 'Contact' : 'Contact'}
        </a>
      </section>
    </main>
  );
};

export default Hans;