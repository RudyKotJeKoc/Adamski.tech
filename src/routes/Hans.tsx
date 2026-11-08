import React, { useEffect, useMemo, useState } from 'react';
import { LanguageSwitcher, Locale } from '../components';
import { SiteBackdrop } from '../components/ui/SiteBackdrop';

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
    <>
    <SiteBackdrop />
    <main className="max-w-screen-sm mx-auto px-4 md:px-8 lg:px-12 py-12">
      <div className="panel panel--lg hud-corners p-6 md:p-8">
      <p className="hud-code mb-4">DAREMON ENGINEERING // ADAMSKI.TECH</p>
      <header className="mb-6">
        <h1 className="hud-title text-2xl md:text-3xl">
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
        <a href={projectsHref} className="btn btn--secondary btn--block">
          {locale === 'pl' ? 'Projekty B2B' : locale === 'en' ? 'B2B Projects' : 'B2B Projecten'}
        </a>
        <a href="mailto:Dariusz@Adamski.tech?subject=Partner%20inquiry%20—%20Hans" className="btn btn--ghost btn--block">
          {locale === 'pl' ? 'Kontakt' : locale === 'en' ? 'Contact' : 'Contact'}
        </a>
      </section>
      </div>
    </main>
    </>
  );
};

export default Hans;