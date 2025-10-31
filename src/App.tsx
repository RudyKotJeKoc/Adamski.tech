import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import contentAll from '../content/content.json';
import { Navbar, Footer, SectionHeading, ProjectCard, SkillTag, Reveal, LanguageSwitcher, Locale } from './components';

type SectionId = 'hero' | 'about' | 'skills' | 'projects' | 'contact';

type ContentLang = typeof contentAll['pl'];
type ContentMap = { pl: ContentLang; en: ContentLang; nl: ContentLang };

const LocaleContext = createContext<{ locale: Locale; setLocale: (loc: Locale) => void }>({ locale: 'pl', setLocale: () => {} });

const App: React.FC = () => {
  const content = contentAll as ContentMap;

  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    const browser = (navigator.language || 'pl').slice(0, 2);
    const initial = stored ?? (['pl', 'en', 'nl'].includes(browser) ? (browser as Locale) : 'pl');
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
    const metaTitle = content[locale].meta?.title || 'Adamski.tech';
    const metaDesc =
      content[locale].meta?.description ||
      'Profesjonalna wizytówka inżyniera automatyki i utrzymania ruchu.';
    document.title = metaTitle;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', metaDesc);
  }, [locale]);

  const labels = useMemo(
    () => [
      { id: 'hero', label: content[locale].navigation.hero },
      { id: 'about', label: content[locale].navigation.about },
      { id: 'skills', label: content[locale].navigation.skills },
      { id: 'projects', label: content[locale].navigation.projects },
      { id: 'contact', label: content[locale].navigation.contact }
    ],
    [locale]
  );

  const sectionsRef = {
    hero: useRef<HTMLElement | null>(null),
    about: useRef<HTMLElement | null>(null),
    skills: useRef<HTMLElement | null>(null),
    projects: useRef<HTMLElement | null>(null),
    contact: useRef<HTMLElement | null>(null)
  };

  const [activeId, setActiveId] = useState<string | null>('hero');

  useEffect(() => {
    const options: IntersectionObserverInit = { threshold: 0.5 };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const id = (e.target as HTMLElement).id as SectionId;
        if (e.isIntersecting) setActiveId(id);
      });
    }, options);
    Object.values(sectionsRef).forEach((ref) => {
      if (ref.current) obs.observe(ref.current);
    });
    return () => obs.disconnect();
  }, []);

  // Smooth scroll offset handled via scroll-margin in CSS (.section)
  const year = new Date().getFullYear();

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <a className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:px-3 focus:py-2 focus:rounded-button focus:bg-surface.card focus:text-neutral-50" href="#main">
        Pomiń nawigację
      </a>

      <Navbar labels={labels} activeId={activeId} locale={locale} onLocaleChange={setLocale} />

      <main id="main" className="max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Hero */}
        <section
          id="hero"
          ref={sectionsRef.hero as React.RefObject<HTMLElement>}
          aria-labelledby="hero-title"
          className="section min-h-[60vh] md:min-h-[70vh] lg:min-h-[75vh] flex items-center bg-hero-bg rounded-card px-4 md:px-8 mt-8"
        >
          <div className="w-full grid md:grid-cols-2 gap-6 items-center">
            <Reveal>
              <div>
                <h1 id="hero-title" className="text-3xl md:text-5xl font-heading font-semibold text-neutral-50">
                  {content[locale].hero.heading}
                </h1>
                <p className="text-neutral-300 mt-4 md:text-lg">{content[locale].hero.subheading}</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    href="#contact"
                    className="px-5 py-3 rounded-button text-white bg-gradient-to-r from-primary-600 to-accent-led hover:from-primary-700 hover:to-accent-led"
                  >
                    {content[locale].hero.cta_primary}
                  </a>
                  <a
                    href="#projects"
                    className="px-5 py-3 rounded-button border border-primary-600 text-primary-50 !bg-transparent !hover:bg-transparent hover:text-white"
                  >
                    {content[locale].hero.cta_secondary}
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal className="hidden md:block">
              <div className="rounded-card bg-surface.card border border-surface-border h-64 shadow-card" aria-hidden="true" />
            </Reveal>
          </div>
        </section>

        {/* About */}
        <section
          id="about"
          ref={sectionsRef.about as React.RefObject<HTMLElement>}
          aria-labelledby="about-title"
          className="section mt-24"
        >
          <SectionHeading id="about-title" title={content[locale].about.title} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content[locale].about.paragraphs.map((p, idx) => (
              <Reveal key={idx}>
                <article className="rounded-card bg-surface.card border border-surface-border p-4 shadow-card">
                  <p className="text-neutral-200">{p}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section
          id="skills"
          ref={sectionsRef.skills as React.RefObject<HTMLElement>}
          aria-labelledby="skills-title"
          className="section mt-24"
        >
          <SectionHeading id="skills-title" title={content[locale].skills.title} />
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {content[locale].skills.categories.map((cat) => (
              <Reveal key={cat.name}>
                <article className="rounded-card bg-surface.card border border-surface-border p-4 shadow-card">
                  <h3 className="font-heading font-semibold text-neutral-50 mb-2">{cat.name}</h3>
                  <ul className="flex flex-wrap gap-2" role="list">
                    {cat.items.map((it) => (
                      <li key={it}><SkillTag label={it} /></li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section
          id="projects"
          ref={sectionsRef.projects as React.RefObject<HTMLElement>}
          aria-labelledby="projects-title"
          className="section mt-24"
        >
          <SectionHeading id="projects-title" title={content[locale].projects.title} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content[locale].projects.items.map((pr) => (
              <Reveal key={pr.name}>
                <ProjectCard
                  name={pr.name}
                  tagline={pr.tagline}
                  description={pr.description}
                  tech={pr.tech}
                  links={pr.links}
                />
              </Reveal>
            ))}
          </div>
          <div className="mt-6">
            <a href="#contact" className="text-primary-500 hover:text-primary-300">
              {locale === 'pl' ? 'Chcesz podobne wdrożenie? Skontaktuj się' : locale === 'en' ? 'Want a similar implementation? Get in touch' : 'Wil je iets soortgelijks? Neem contact op'}
            </a>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          ref={sectionsRef.contact as React.RefObject<HTMLElement>}
          aria-labelledby="contact-title"
          className="section mt-24"
        >
          <SectionHeading id="contact-title" title={content[locale].contact.title} subtitle={content[locale].contact.subtitle} />
          <div className="grid md:grid-cols-2 gap-8">
            <form
              id="contact-form"
              aria-describedby="contact-note"
              className="rounded-card bg-surface.card border border-surface-border p-4 shadow-card"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const fd = new FormData(form);
                const name = String(fd.get('name') || '');
                const email = String(fd.get('email') || '');
                const message = String(fd.get('message') || '');
                const subject = encodeURIComponent(`Kontakt z Adamski.tech — ${name}`);
                const body = encodeURIComponent(`Imię i nazwisko: ${name}\nEmail: ${email}\n\nWiadomość:\n${message}`);
                window.location.href = `mailto:TODO:email?subject=${subject}&body=${body}`;
              }}
            >
              <label htmlFor="name" className="block text-neutral-200 mb-1">Imię i nazwisko</label>
              <input id="name" name="name" required autoComplete="name" className="w-full rounded-button bg-background-elevated border border-surface-border px-3 py-2 mb-4" />
              <label htmlFor="email" className="block text-neutral-200 mb-1">{content[locale].contact.email_label}</label>
              <input id="email" type="email" name="email" required autoComplete="email" className="w-full rounded-button bg-background-elevated border border-surface-border px-3 py-2 mb-4" />
              <label htmlFor="message" className="block text-neutral-200 mb-1">Wiadomość</label>
              <textarea id="message" name="message" rows={6} required className="w-full rounded-card bg-background-elevated border border-surface-border px-3 py-2 mb-4" />
              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 rounded-button text-white bg-gradient-to-r from-primary-600 to-accent-led hover:from-primary-700 hover:to-accent-led">
                  Wyślij
                </button>
                <a href="mailto:TODO:email" className="px-4 py-2 rounded-button border border-primary-600 text-primary-50 !bg-transparent !hover:bg-transparent hover:text-white">
                  Wyślij email
                </a>
              </div>
              <small id="contact-note" className="block mt-3 text-neutral-400">
                Dane wykorzystane wyłącznie do kontaktu. TODO: link do polityki prywatności.
              </small>
            </form>
            <div className="rounded-card bg-surface.card border border-surface-border p-4 shadow-card">
              <h3 className="font-heading font-semibold text-neutral-50 mb-2">Alternatywny kontakt</h3>
              <ul className="space-y-2">
                <li>
                  <a className="text-neutral-300 hover:text-neutral-50" href={content[locale].contact.socials.github || '#'}>
                    GitHub
                  </a>
                </li>
                <li>
                  <a className="text-neutral-300 hover:text-neutral-50" href={content[locale].contact.socials.linkedin || '#'}>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a className="text-neutral-300 hover:text-neutral-50" href={content[locale].contact.socials.youtube || '#'}>
                    YouTube
                  </a>
                </li>
              </ul>
              <p className="mt-3 text-neutral-300">{content[locale].contact.availability_note}</p>
            </div>
          </div>
        </section>

        <Footer year={year} labels={labels} />
      </main>
    </LocaleContext.Provider>
  );
};

export default App;