import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import contentAll from '../content/content.json';
import {
  Navbar,
  Footer,
  SectionHeading,
  ProjectCard,
  SkillTag,
  Reveal,
  LanguageSwitcher,
  Locale,
  MetricCounter,
  WorkflowDiagram,
  TimelineSlider,
  PartnerCard
} from './components';

type SectionId = 'hero' | 'about' | 'ai' | 'equipment' | 'skills' | 'career' | 'projects' | 'brand' | 'partners' | 'contact';

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
      { id: 'ai', label: content[locale].navigation.ai },
      { id: 'equipment', label: content[locale].navigation.equipment },
      { id: 'skills', label: content[locale].navigation.skills },
      { id: 'career', label: content[locale].navigation.career },
      { id: 'projects', label: content[locale].navigation.projects },
      { id: 'brand', label: content[locale].navigation.brand },
      { id: 'partners', label: content[locale].navigation.partners },
      { id: 'contact', label: content[locale].navigation.contact }
    ],
    [locale]
  );

  const sectionsRef = {
    hero: useRef<HTMLElement | null>(null),
    about: useRef<HTMLElement | null>(null),
    ai: useRef<HTMLElement | null>(null),
    equipment: useRef<HTMLElement | null>(null),
    skills: useRef<HTMLElement | null>(null),
    career: useRef<HTMLElement | null>(null),
    projects: useRef<HTMLElement | null>(null),
    brand: useRef<HTMLElement | null>(null),
    partners: useRef<HTMLElement | null>(null),
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

        {/* AI Methodology */}
        <section
          id="ai"
          ref={sectionsRef.ai as React.RefObject<HTMLElement>}
          aria-labelledby="ai-title"
          className="section mt-24"
        >
          <SectionHeading
            id="ai-title"
            title={content[locale].ai_methodology.title}
            subtitle={content[locale].ai_methodology.subtitle}
          />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)]">
            <div className="grid gap-4 sm:grid-cols-2">
              {content[locale].ai_methodology.metrics.map((metric) => (
                <Reveal key={metric.id}>
                  <MetricCounter
                    value={metric.value}
                    suffix={metric.suffix}
                    label={metric.label}
                    description={metric.description}
                    locale={locale}
                  />
                </Reveal>
              ))}
            </div>
            <Reveal>
              <article className="rounded-card border border-surface-border bg-surface.card/90 p-6 shadow-card">
                <h3 className="text-xl font-heading text-neutral-50">{content[locale].ai_methodology.workflow.title}</h3>
                <p className="mt-3 text-neutral-300">{content[locale].ai_methodology.subtitle}</p>
                <div className="mt-6">
                  <WorkflowDiagram phases={content[locale].ai_methodology.workflow.phases} />
                </div>
                {content[locale].ai_methodology.workflow.automation.length > 0 && (
                  <div className="mt-6 rounded-card border border-dashed border-surface-border bg-background-elevated/60 p-4">
                    <h4 className="text-sm uppercase tracking-wide text-primary-300">
                      {locale === 'pl'
                        ? 'Warstwa automatyzacji'
                        : locale === 'en'
                        ? 'Automation layer'
                        : 'Automatiseringslaag'}
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-neutral-200" role="list">
                      {content[locale].ai_methodology.workflow.automation.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            </Reveal>
          </div>
        </section>

        {/* Equipment Inventory */}
        <section
          id="equipment"
          ref={sectionsRef.equipment as React.RefObject<HTMLElement>}
          aria-labelledby="equipment-title"
          className="section mt-24"
        >
          <SectionHeading
            id="equipment-title"
            title={content[locale].equipment_inventory.title}
            subtitle={content[locale].equipment_inventory.subtitle}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {content[locale].equipment_inventory.categories.map((category) => (
              <Reveal key={category.name}>
                <article className="rounded-card border border-surface-border bg-surface.card/80 p-5 shadow-card">
                  <header className="mb-4 flex items-start justify-between gap-2">
                    <h3 className="text-xl font-heading text-neutral-50">{category.name}</h3>
                    <span className="text-sm text-neutral-400">{category.items.length} {locale === 'pl' ? 'pozycji' : locale === 'en' ? 'assets' : 'items'}</span>
                  </header>
                  <ul className="grid gap-4" role="list">
                    {category.items.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-card border border-surface-border/70 bg-background-elevated/60 p-4 transition hover:border-primary-500"
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && (
                            <span
                              aria-hidden="true"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-700/50 text-xl"
                            >
                              {item.icon}
                            </span>
                          )}
                          <div>
                            <h4 className="font-heading text-neutral-50">{item.name}</h4>
                            <p className="text-xs uppercase tracking-wide text-primary-300">{item.status}</p>
                          </div>
                        </div>
                        {item.specs?.length > 0 && (
                          <ul className="mt-3 space-y-1 text-sm text-neutral-200" role="list">
                            {item.specs.map((spec) => (
                              <li key={spec} className="flex items-start gap-2">
                                <span aria-hidden="true" className="mt-1 h-1 w-1 rounded-full bg-accent-led" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
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

        {/* Career Timeline */}
        <section
          id="career"
          ref={sectionsRef.career as React.RefObject<HTMLElement>}
          aria-labelledby="career-title"
          className="section mt-24"
        >
          <SectionHeading
            id="career-title"
            title={content[locale].career_timeline.title}
            subtitle={content[locale].career_timeline.subtitle}
          />
          <Reveal>
            <TimelineSlider
              milestones={content[locale].career_timeline.milestones}
              label={
                locale === 'pl'
                  ? `${content[locale].career_timeline.title} — oś czasu`
                  : locale === 'nl'
                  ? `${content[locale].career_timeline.title} — tijdlijn`
                  : `${content[locale].career_timeline.title} timeline`
              }
            />
          </Reveal>
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

        {/* Daremon Brand */}
        <section
          id="brand"
          ref={sectionsRef.brand as React.RefObject<HTMLElement>}
          aria-labelledby="brand-title"
          className="section mt-24"
        >
          <SectionHeading id="brand-title" title={content[locale].brand.title} />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)]">
            <Reveal>
              <article className="rounded-card border border-surface-border bg-surface.card/80 p-6 shadow-card">
                <h3 className="text-xl font-heading text-neutral-50">{content[locale].brand.philosophy.title}</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {content[locale].brand.philosophy.items.map((item) => (
                    <div key={item.id} className="rounded-card border border-surface-border/60 bg-background-elevated/60 p-4">
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-700/60 text-xl">
                            {item.icon}
                          </span>
                        )}
                        <h4 className="font-heading text-neutral-50">{item.name}</h4>
                      </div>
                      <p className="mt-2 text-sm text-neutral-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
            <Reveal>
              <article className="rounded-card border border-surface-border bg-surface.card/80 p-6 shadow-card">
                <h3 className="text-xl font-heading text-neutral-50">{content[locale].brand.services.title}</h3>
                <div className="mt-5 space-y-4">
                  {content[locale].brand.services.items.map((service) => (
                    <article
                      key={service.id}
                      className="rounded-card border border-surface-border/70 bg-background-elevated/60 p-5 transition hover:border-primary-500"
                    >
                      <h4 className="text-lg font-heading text-neutral-50">{service.name}</h4>
                      <p className="mt-2 text-neutral-200">{service.description}</p>
                      {service.deliverables?.length > 0 && (
                        <ul className="mt-3 space-y-1 text-sm text-neutral-200" role="list">
                          {service.deliverables.map((deliverable) => (
                            <li key={deliverable} className="flex items-start gap-2">
                              <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" />
                              <span>{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {service.cta && <p className="mt-4 text-sm font-medium text-primary-300">{service.cta}</p>}
                    </article>
                  ))}
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        {/* Partners */}
        <section
          id="partners"
          ref={sectionsRef.partners as React.RefObject<HTMLElement>}
          aria-labelledby="partners-title"
          className="section mt-24"
        >
          <SectionHeading
            id="partners-title"
            title={content[locale].partners.title}
            subtitle={content[locale].partners.subtitle}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content[locale].partners.cards.map((card) => (
              <Reveal key={card.id}>
                <PartnerCard
                  icon={card.icon}
                  title={card.title}
                  valueProposition={card.value_proposition}
                  idealFor={card.ideal_for}
                  highlights={card.highlights}
                  ctaLabel={card.cta_label}
                />
              </Reveal>
            ))}
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