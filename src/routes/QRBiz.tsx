import React, { useEffect, useMemo, useState } from 'react';
import cta from '../../copy/cta.json';
import intro from '../../copy/landing_intro.json';
import { LanguageSwitcher, Locale } from '../components';

type CTAMap = typeof cta;
type IntroMap = typeof intro;

const setRouteMeta = (title: string, description: string, path: string, locale: Locale) => {
  document.title = title;
  const descTag = document.querySelector('meta[name="description"]');
  if (descTag) descTag.setAttribute('content', description);

  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = `${location.origin}${path}`;

  // hreflang alternates
  const existing = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]'));
  existing.forEach((el) => el.remove());
  const langs: Locale[] = ['pl', 'en', 'nl'];
  langs.forEach((l) => {
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

const QRBiz: React.FC = () => {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    const browser = (navigator.language || 'pl').slice(0, 2) as Locale;
    return stored ?? (['pl', 'en', 'nl'].includes(browser) ? browser : 'pl');
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    const titles: Record<Locale, string> = {
      pl: 'Adamski.tech — QR Landing (Biz)',
      en: 'Adamski.tech — QR Landing (Biz)',
      nl: 'Adamski.tech — QR Landing (Biz)'
    };
    const descs: Record<Locale, string> = {
      pl: 'Szybki landing: pobierz vCard, zobacz portfolio i umów rozmowę. Zachowujemy UTM.',
      en: 'Quick landing: download vCard, view portfolio, and book a call. We preserve UTM.',
      nl: 'Snelle landing: vCard downloaden, portfolio bekijken en een gesprek plannen. UTM behouden.'
    };
    setRouteMeta(titles[locale], descs[locale], '/qr/biz', locale);
  }, [locale]);

  const search = location.search;
  const portfolioHref = useMemo(() => `/${search}#projects`, [search]);

  const email = 'Dariusz@Adamski.tech';
  const subject: Record<Locale, string> = {
    pl: 'Konsultacja techniczna — Adamski.tech',
    en: 'Technical consultation — Adamski.tech',
    nl: 'Technisch gesprek — Adamski.tech'
  };
  const bodyPre: Record<Locale, string> = {
    pl: 'Źródło: QR, kampania: adamski_card_v1, UTM: ',
    en: 'Source: QR, campaign: adamski_card_v1, UTM: ',
    nl: 'Bron: QR, campagne: adamski_card_v1, UTM: '
  };
  const mailtoHref = useMemo(() => {
    const s = encodeURIComponent(subject[locale]);
    const b = encodeURIComponent(`${bodyPre[locale]}${search}`);
    return `mailto:${email}?subject=${s}&body=${b}`;
  }, [locale, search]);

  const labels = {
    vcard: (cta as CTAMap)[locale].vcard,
    portfolio: (cta as CTAMap)[locale].portfolio,
    consultation: (cta as CTAMap)[locale].consultation
  };
  const lead = (intro as IntroMap)[locale];

  return (
    <main className="max-w-screen-sm mx-auto px-4 md:px-8 lg:px-12 py-12">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-heading font-semibold text-neutral-50">Daremon Engineering</h1>
        <p className="text-neutral-300 mt-2">{lead}</p>
      </header>

      <div className="flex items-center justify-between mb-8">
        <LanguageSwitcher locale={locale} onChange={setLocale} />
      </div>

      <section className="grid gap-4">
        <a href="/vcard.vcf" download className="px-5 py-3 rounded-button text-white bg-gradient-to-r from-primary-600 to-accent-led hover:from-primary-700 hover:to-accent-led">
          {labels.vcard}
        </a>
        <a href={portfolioHref} className="px-5 py-3 rounded-button border border-primary-600 text-primary-50 !bg-transparent !hover:bg-transparent hover:text-white">
          {labels.portfolio}
        </a>
        <a href={mailtoHref} className="px-5 py-3 rounded-button border border-accent-blue_tech text-accent-blue_tech !bg-transparent !hover:bg-transparent hover:text-white">
          {labels.consultation}
        </a>
      </section>
    </main>
  );
};

export default QRBiz;